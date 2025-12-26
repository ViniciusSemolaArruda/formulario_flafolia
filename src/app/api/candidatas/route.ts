// src/app/api/candidatas/route.ts
import { NextResponse } from "next/server";
import type { UploadApiResponse } from "cloudinary";

import { candidateSchema } from "@/app/lib/validation";
import { cloudinary } from "@/app/lib/cloudinary";
import { getPrisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

function errorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return "Erro interno.";
  }
}

function normalizeInstagram(v: string | undefined) {
  if (!v) return v;
  return v.trim().replace(/^@+/, "");
}

/**
 * Aceita:
 * - "DD/MM/AAAA" -> "YYYY-MM-DD"
 * - "YYYY-MM-DD" -> "YYYY-MM-DD"
 */
function normalizeBirthDate(v: string | undefined) {
  const raw = (v ?? "").trim();
  if (!raw) return raw;

  // Já veio ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  // Veio BR
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
    const [dd, mm, yyyy] = raw.split("/");
    return `${yyyy}-${mm}-${dd}`;
  }

  // deixa como está (o schema vai acusar se estiver inválido)
  return raw;
}

function isFile(v: FormDataEntryValue | null): v is File {
  return !!v && typeof v === "object" && v instanceof File;
}

async function fileToDataUri(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const base64 = Buffer.from(buf).toString("base64");
  const mime = file.type || "application/octet-stream";
  return `data:${mime};base64,${base64}`;
}

async function uploadImage(file: File, folder: string): Promise<string> {
  const maxBytes = 8 * 1024 * 1024; // 8MB
  if (file.size > maxBytes) throw new Error("Imagem acima do limite de 8MB.");

  // iPhone pode mandar HEIC/HEIF
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
    "image/heic",
    "image/heif",
  ];

  if (file.type && !allowed.includes(file.type)) {
    throw new Error("Formato de imagem inválido. Use JPG/PNG/WEBP.");
  }

  const dataUri = await fileToDataUri(file);

  const res: UploadApiResponse = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });

  return res.secure_url;
}

export async function POST(req: Request) {
  try {
    const prisma = getPrisma();
    const form = await req.formData();

    const photoFaceRaw = form.get("photoFace");
    const photoBodyRaw = form.get("photoBody");

    // pega arquivos
    const photoFace = isFile(photoFaceRaw) ? photoFaceRaw : null;
    const photoBody = isFile(photoBodyRaw) ? photoBodyRaw : null;

    // tudo que não é arquivo, vira string
    const obj: Record<string, string> = {};
    form.forEach((value, key) => {
      if (key === "photoFace" || key === "photoBody") return;
      if (typeof value === "string") obj[key] = value;
    });

    // normalizações (não muda lógica do app, só evita 400 no mobile)
    obj.instagram = normalizeInstagram(obj.instagram) ?? "";
    obj.birthDate = normalizeBirthDate(obj.birthDate) ?? "";

    // pergunta removida do formulário -> garante um valor válido pro schema/DB
    if (!obj.sambaTime) {
      obj.sambaTime = "FROM_1_TO_3_YEARS";
    }

    const parsed = candidateSchema.safeParse(obj);

    if (!parsed.success) {
      const issues: Record<string, string> = {};
      for (const i of parsed.error.issues) {
        const key = String(i.path?.[0] ?? "form");
        issues[key] = i.message;
      }
      return NextResponse.json(
        { ok: false, message: "Revise os campos do formulário.", issues },
        { status: 400 }
      );
    }

    if (!photoFace || !photoBody) {
      return NextResponse.json(
        { ok: false, message: "Envie as duas imagens (rosto e corpo inteiro)." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const [faceUrl, bodyUrl] = await Promise.all([
      uploadImage(photoFace, "flafolia/rainha/rosto"),
      uploadImage(photoBody, "flafolia/rainha/corpo"),
    ]);

    const created = await prisma.candidate.create({
      data: {
        fullName: data.fullName,
        artisticName: data.artisticName || null, // (no front você pode renomear o label para "Nome social")
        birthDate: new Date(data.birthDate),
        phoneWhatsapp: data.phoneWhatsapp,
        email: data.email,
        city: data.city,
        neighborhood: data.neighborhood || null,
        instagram: data.instagram || null,

        hasParticipatedBefore: data.hasParticipatedBefore === "true",
        participatedDetails: data.participatedDetails || null,

        sambaTime: data.sambaTime,
        hasLiveBatteryExp: data.hasLiveBatteryExp === "true",

        availableNightsWeekend: data.availableNightsWeekend === "true",
        awarePresenceRequired: true,

        photoFaceUrl: faceUrl,
        photoBodyUrl: bodyUrl,

        isOver18: true,
        availableAllRehearsals: true,
        awareRepresentBlock: true,
        acceptedRegulation: true,
        authorizedImageUse: true,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err: unknown) {
    const msg = errorMessage(err);
    return NextResponse.json({ ok: false, message: msg, error: msg }, { status: 500 });
  }
}
