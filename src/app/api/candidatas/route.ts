import { NextResponse } from "next/server"
import type { UploadApiResponse } from "cloudinary"

import { candidateSchema } from "../../lib/validation"
import { prisma } from "../../lib/prisma"
import { cloudinary } from "../../lib/cloudinary"

export const runtime = "nodejs"

async function fileToDataUri(file: File): Promise<string> {
  const buf = await file.arrayBuffer()
  const base64 = Buffer.from(buf).toString("base64")
  const mime = file.type || "application/octet-stream"
  return `data:${mime};base64,${base64}`
}

async function uploadImage(file: File, folder: string): Promise<string> {
  const maxBytes = 8 * 1024 * 1024 // 8MB
  if (file.size > maxBytes) throw new Error("Imagem acima do limite de 8MB.")

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
  if (!allowed.includes(file.type)) {
    throw new Error("Formato de imagem inválido. Use JPG/PNG/WEBP.")
  }

  const dataUri = await fileToDataUri(file)

  const res: UploadApiResponse = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  })

  return res.secure_url
}

function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === "string") return err
  try {
    return JSON.stringify(err)
  } catch {
    return "Erro interno."
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()

    const photoFace = form.get("photoFace")
    const photoBody = form.get("photoBody")

    // tudo que não é arquivo vira string
    const obj: Record<string, string> = {}
    form.forEach((v, k) => {
      if (k === "photoFace" || k === "photoBody") return
      if (typeof v === "string") obj[k] = v
    })

    const parsed = candidateSchema.safeParse(obj)

    if (!parsed.success) {
      const issues: Record<string, string> = {}
      for (const i of parsed.error.issues) {
        const key = String(i.path?.[0] ?? "form")
        issues[key] = i.message
      }
      return NextResponse.json(
        { ok: false, message: "Revise os campos do formulário.", issues },
        { status: 400 }
      )
    }

    if (!(photoFace instanceof File) || !(photoBody instanceof File)) {
      return NextResponse.json(
        { ok: false, message: "Envie as duas imagens (rosto e corpo inteiro)." },
        { status: 400 }
      )
    }

    const data = parsed.data

    const [faceUrl, bodyUrl] = await Promise.all([
      uploadImage(photoFace, "flafolia/rainha/rosto"),
      uploadImage(photoBody, "flafolia/rainha/corpo"),
    ])

    const created = await prisma.candidate.create({
      data: {
        fullName: data.fullName,
        artisticName: data.artisticName || null,
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
    })

    return NextResponse.json({ ok: true, id: created.id })
  } catch (err: unknown) {
    const message = toErrorMessage(err)

    // log no terminal do Next (pra você ver o erro REAL)
    console.error("[POST /api/candidatas] error:", err)

    return NextResponse.json(
      { ok: false, message, debug: { message } },
      { status: 500 }
    )
  }
}
