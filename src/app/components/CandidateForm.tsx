"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import FormField from "./FormField";
import TermsLinks from "./TermsLinks";

type YesNoStr = "true" | "false" | ""; // agora permite "vazio" para iniciar desmarcado

type FormValues = {
  // DADOS PESSOAIS
  fullName: string;

  hasSocialName: boolean;
  socialName?: string;

  // agora o usuário digita DD/MM/AAAA
  birthDate: string;

  phoneWhatsapp: string;
  email: string;
  city: string;
  neighborhood?: string;
  instagram?: string;

  // SAMBA / EXPERIÊNCIA
  hasParticipatedBefore: YesNoStr;
  participatedDetails?: string;

  hasLiveBatteryExp: YesNoStr;
  availableNightsWeekend: YesNoStr;

  // Confirmações
  awarePresenceRequired: boolean; // checkbox
  isOver18: boolean;
  availableAllRehearsals: boolean;
  awareRepresentBlock: boolean;
  acceptedRegulation: boolean;
  authorizedImageUse: boolean;

  // Imagens
  photoFace: FileList;
  photoBody: FileList;
};

type ApiResult =
  | { ok: true; id: string }
  | { ok: false; message: string; issues?: Partial<Record<keyof FormValues, string>> };

function RadioYesNo(props: {
  name: keyof FormValues;
  labelYes?: string;
  labelNo?: string;
  value: YesNoStr;
  onChange: (v: YesNoStr) => void;
}) {
  const { labelYes = "Sim", labelNo = "Não", value, onChange } = props;

  const item: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#fff",
    cursor: "pointer",
    userSelect: "none",
    width: "100%",
  };

  const text: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 700,
    color: "#111",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, minWidth: 0 }}>
      <label style={item}>
        <input
          type="radio"
          checked={value === "true"}
          onChange={() => onChange("true")}
          style={{ margin: 0 }}
        />
        <span style={text}>{labelYes}</span>
      </label>

      <label style={item}>
        <input
          type="radio"
          checked={value === "false"}
          onChange={() => onChange("false")}
          style={{ margin: 0 }}
        />
        <span style={text}>{labelNo}</span>
      </label>
    </div>
  );
}

/** mantém só números e aplica máscara DD/MM/AAAA */
function maskBirthDateBR(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 8); // DDMMYYYY
  const dd = digits.slice(0, 2);
  const mm = digits.slice(2, 4);
  const yyyy = digits.slice(4, 8);

  if (digits.length <= 2) return dd;
  if (digits.length <= 4) return `${dd}/${mm}`;
  return `${dd}/${mm}/${yyyy}`;
}

/** valida DD/MM/AAAA (simples, mas confiável) */
function isValidBirthDateBR(v: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(v)) return false;
  const [dStr, mStr, yStr] = v.split("/");
  const d = Number(dStr);
  const m = Number(mStr);
  const y = Number(yStr);

  if (y < 1900 || y > 2100) return false;
  if (m < 1 || m > 12) return false;

  const maxDay = new Date(y, m, 0).getDate(); // último dia do mês
  if (d < 1 || d > maxDay) return false;

  return true;
}

/** converte DD/MM/AAAA -> YYYY-MM-DD */
function toIsoDateFromBR(v: string) {
  const [d, m, y] = v.split("/");
  return `${y}-${m}-${d}`;
}

export default function CandidateForm() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    setValue,
    getValues,
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      // tudo vazio/desmarcado como na imagem
      fullName: "",
      hasSocialName: false,
      socialName: "",

      birthDate: "",

      phoneWhatsapp: "",
      email: "",
      city: "",
      neighborhood: "",
      instagram: "",

      hasParticipatedBefore: "",
      participatedDetails: "",

      hasLiveBatteryExp: "",
      availableNightsWeekend: "",

      // checkboxes todos desmarcados
      awarePresenceRequired: false,
      isOver18: false,
      availableAllRehearsals: false,
      awareRepresentBlock: false,
      acceptedRegulation: false,
      authorizedImageUse: false,
    },
  });

  const hasSocialName = watch("hasSocialName");
  const hasParticipatedBefore = watch("hasParticipatedBefore");
  const hasLiveBatteryExp = watch("hasLiveBatteryExp");
  const availableNightsWeekend = watch("availableNightsWeekend");

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    setResult(null);

    try {
      const face: File | undefined = data.photoFace?.item(0) ?? undefined;
      const body: File | undefined = data.photoBody?.item(0) ?? undefined;

      const fd = new FormData();

      // converte a data (DD/MM/AAAA -> YYYY-MM-DD) antes de enviar
      const birthBR = (data.birthDate ?? "").trim();
      const birthISO = toIsoDateFromBR(birthBR);

      (Object.entries(data) as Array<[keyof FormValues, FormValues[keyof FormValues]]>).forEach(([k, v]) => {
        if (k === "photoFace" || k === "photoBody") return;
        if (typeof v === "undefined" || v === null) return;

        if (k === "birthDate") {
          fd.append("birthDate", birthISO);
          return;
        }

        if (typeof v === "boolean") {
          fd.append(String(k), v ? "true" : "false");
          return;
        }

        fd.append(String(k), String(v));
      });

      if (face) fd.append("photoFace", face);
      if (body) fd.append("photoBody", body);

      const res = await fetch("/api/candidatas", { method: "POST", body: fd });
      const json = (await res.json()) as ApiResult;

      if (!json.ok) {
        setResult(json);

        if (json.issues) {
          (Object.entries(json.issues) as Array<[keyof FormValues, string]>).forEach(([field, message]) => {
            setError(field, { type: "server", message });
          });
        }
        return;
      }

      setResult(json);
      reset();
    } catch {
      setResult({ ok: false, message: "Falha ao enviar inscrição. Tente novamente." });
    } finally {
      setSubmitting(false);
    }
  });

  const inputStyle: React.CSSProperties = useMemo(
    () => ({
      width: "100%",
      minWidth: 0,
      border: "1px solid rgba(0,0,0,0.18)",
      borderRadius: 12,
      padding: "11px 12px",
      fontSize: 14,
      outline: "none",
      background: "#fff",
    }),
    []
  );

  const sectionTitle: React.CSSProperties = {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: 0.2,
    opacity: 0.9,
    textTransform: "uppercase",
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: 920,
    margin: "0 auto",
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 16,
    padding: 18,
    background: "#fff",
    boxShadow: "0 10px 34px rgba(0,0,0,0.07)",
    overflow: "hidden",
  };

  const grid2: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 14,
    minWidth: 0,
  };

  return (
    <form onSubmit={onSubmit} style={cardStyle}>
      <style jsx>{`
        @media (min-width: 780px) {
          .grid2 {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          }
        }
      `}</style>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <Image
          src="/logo.png"
          alt="Logo Bloco FLAFOLIA"
          width={230}
          height={230}
          priority
          style={{ display: "block", height: "auto" }}
        />
      </div>

      <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 4, textAlign: "center" }}>
        Inscrição — Rainha do Bloco FLAFOLIA
      </h1>
      <p style={{ fontSize: 13, opacity: 0.75, marginTop: 0, textAlign: "center" }}>
        Preencha com atenção. As informações e imagens devem ser recentes e verdadeiras.
      </p>

      <div style={sectionTitle}>Dados pessoais</div>

      <div className="grid2" style={grid2}>
        <FormField label="Nome completo" error={errors.fullName?.message}>
          <input style={inputStyle} {...register("fullName", { required: "Obrigatório" })} />
        </FormField>

        <FormField label="Data de nascimento" error={errors.birthDate?.message}>
          <input
            style={inputStyle}
            inputMode="numeric"
            autoComplete="bday"
            placeholder="DD/MM/AAAA"
            maxLength={10}
            {...register("birthDate", {
              required: "Obrigatório",
              validate: (v) => {
                const val = (v ?? "").trim();
                return isValidBirthDateBR(val) || "Data inválida (use DD/MM/AAAA)";
              },
              onChange: (e) => {
                const masked = maskBirthDateBR(e.target.value);
                setValue("birthDate", masked, { shouldValidate: true, shouldDirty: true });
              },
            })}
            value={getValues("birthDate")}
          />
        </FormField>

        <FormField label="Telefone / WhatsApp" error={errors.phoneWhatsapp?.message}>
          <input style={inputStyle} {...register("phoneWhatsapp", { required: "Obrigatório" })} />
        </FormField>

        <FormField label="E-mail" error={errors.email?.message}>
          <input type="email" style={inputStyle} {...register("email", { required: "Obrigatório" })} />
        </FormField>

        <FormField label="Cidade" error={errors.city?.message}>
          <input style={inputStyle} {...register("city", { required: "Obrigatório" })} />
        </FormField>

        <FormField label="Bairro" hint="Opcional" error={errors.neighborhood?.message}>
          <input style={inputStyle} {...register("neighborhood")} />
        </FormField>

        <FormField label="Instagram (@)" hint="Opcional" error={errors.instagram?.message}>
          <input style={inputStyle} placeholder="@seuuser" {...register("instagram")} />
        </FormField>

        <FormField label="Nome social" hint="Marque se você tiver" error={errors.hasSocialName?.message}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "#fff",
              width: "100%",
            }}
          >
            <input
              type="checkbox"
              {...register("hasSocialName")}
              onChange={(e) => {
                const checked = e.currentTarget.checked;
                setValue("hasSocialName", checked);
                if (!checked) setValue("socialName", "");
              }}
              style={{ margin: 0 }}
            />
            <span style={{ fontSize: 14, fontWeight: 800 }}>Tenho nome social</span>
          </label>

          {hasSocialName ? (
            <div style={{ marginTop: 10 }}>
              <input
                style={inputStyle}
                placeholder="Digite seu nome social"
                {...register("socialName", {
                  validate: (v) => {
                    if (!hasSocialName) return true;
                    return (v ?? "").trim().length > 0 || "Obrigatório quando marcado";
                  },
                })}
              />
              {errors.socialName?.message ? (
                <div style={{ marginTop: 6, fontSize: 12, color: "#b00020" }}>{errors.socialName.message}</div>
              ) : null}
            </div>
          ) : null}
        </FormField>
      </div>

      <div style={sectionTitle}>Informações sobre samba e experiência</div>

      <div style={{ display: "grid", gap: 14 }}>
        <FormField
          label="Você já participou de concursos de rainha, musa ou passista?"
          error={errors.hasParticipatedBefore?.message}
        >
          <RadioYesNo
            name="hasParticipatedBefore"
            value={hasParticipatedBefore}
            onChange={(v) => setValue("hasParticipatedBefore", v, { shouldValidate: true, shouldDirty: true })}
          />
          <input
            type="hidden"
            {...register("hasParticipatedBefore", {
              validate: (v) => (v === "true" || v === "false" ? true : "Obrigatório"),
            })}
          />
        </FormField>

        {hasParticipatedBefore === "true" ? (
          <FormField label="Se sim, quais? (campo aberto)" error={errors.participatedDetails?.message}>
            <textarea
              style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
              placeholder="Escreva aqui..."
              {...register("participatedDetails", {
                validate: (v) => {
                  if (hasParticipatedBefore !== "true") return true;
                  return (v ?? "").trim().length > 0 || "Obrigatório quando você marcou SIM";
                },
              })}
            />
          </FormField>
        ) : null}

        <FormField label="Você tem experiência sambando com bateria ao vivo?" error={errors.hasLiveBatteryExp?.message}>
          <RadioYesNo
            name="hasLiveBatteryExp"
            value={hasLiveBatteryExp}
            onChange={(v) => setValue("hasLiveBatteryExp", v, { shouldValidate: true, shouldDirty: true })}
          />
          <input
            type="hidden"
            {...register("hasLiveBatteryExp", {
              validate: (v) => (v === "true" || v === "false" ? true : "Obrigatório"),
            })}
          />
        </FormField>

        <FormField
          label="Disponibilidade para ensaios noturnos e fins de semana?"
          error={errors.availableNightsWeekend?.message}
        >
          <RadioYesNo
            name="availableNightsWeekend"
            value={availableNightsWeekend}
            onChange={(v) => setValue("availableNightsWeekend", v, { shouldValidate: true, shouldDirty: true })}
          />
          <input
            type="hidden"
            {...register("availableNightsWeekend", {
              validate: (v) => (v === "true" || v === "false" ? true : "Obrigatório"),
            })}
          />
        </FormField>

        {/* REMOVIDO: "Há quanto tempo você samba?" */}
      </div>

      <div style={{ marginTop: 14 }}>
        <FormField
          label="Está ciente de que a presença nos eventos oficiais é obrigatória?"
          error={errors.awarePresenceRequired?.message}
        >
          <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14 }}>
            <input type="checkbox" {...register("awarePresenceRequired", { required: "Obrigatório" })} />
            Sim, estou ciente
          </label>
        </FormField>
      </div>

      <div style={sectionTitle}>Imagens</div>

      <div className="grid2" style={grid2}>
        <FormField label="Envio de foto de rosto (recente)" error={errors.photoFace?.message}>
          <input type="file" accept="image/*" style={inputStyle} {...register("photoFace", { required: "Obrigatório" })} />
        </FormField>

        <FormField label="Envio de foto de corpo inteiro (recente)" error={errors.photoBody?.message}>
          <input type="file" accept="image/*" style={inputStyle} {...register("photoBody", { required: "Obrigatório" })} />
        </FormField>
      </div>

      <div style={sectionTitle}>Confirmação de requisitos</div>

      <div style={{ display: "grid", gap: 10 }}>
        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14 }}>
          <input type="checkbox" {...register("isOver18", { required: "Obrigatório" })} />
          Declaro que sou maior de 18 anos
        </label>

        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14 }}>
          <input type="checkbox" {...register("availableAllRehearsals", { required: "Obrigatório" })} />
          Tenho disponibilidade para participar de todos os ensaios e do desfile oficial
        </label>

        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14 }}>
          <input type="checkbox" {...register("awareRepresentBlock", { required: "Obrigatório" })} />
          Estou ciente de que preciso representar o Bloco Flafolia oficialmente, caso seja eleita
        </label>

        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14 }}>
          <input type="checkbox" {...register("acceptedRegulation", { required: "Obrigatório" })} />
          Declaro que li e concordo integralmente com o Regulamento do Concurso Rainha do Bloco Flafolia,
          comprometendo-me a cumprir todas as regras, critérios e obrigações estabelecidas.
        </label>

        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14 }}>
          <input type="checkbox" {...register("authorizedImageUse", { required: "Obrigatório" })} />
          Autorizo o Bloco Flafolia a utilizar minha imagem, nome e voz em fotos, vídeos e materiais de divulgação
          relacionados ao concurso e às atividades do bloco, sem fins comerciais.
        </label>

        <TermsLinks />
      </div>

      <button
        type="submit"
        disabled={submitting}
        style={{
          marginTop: 16,
          width: "100%",
          borderRadius: 12,
          padding: "12px 14px",
          border: "1px solid rgba(0,0,0,0.18)",
          background: submitting ? "rgba(0,0,0,0.06)" : "#111",
          color: submitting ? "#111" : "#fff",
          fontWeight: 900,
          cursor: submitting ? "not-allowed" : "pointer",
        }}
      >
        {submitting ? "Enviando..." : "Enviar inscrição"}
      </button>

      {result ? (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.12)",
            background: result.ok ? "rgba(0,0,0,0.04)" : "rgba(176,0,32,0.06)",
          }}
        >
          {result.ok ? (
            <div style={{ fontSize: 13 }}>
              Inscrição enviada com sucesso. Protocolo: <b>{result.id}</b>
            </div>
          ) : (
            <div style={{ fontSize: 13 }}>
              <b>Não foi possível enviar.</b> {result.message}
            </div>
          )}
        </div>
      ) : null}
    </form>
  );
}
