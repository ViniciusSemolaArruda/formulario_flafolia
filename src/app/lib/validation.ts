import { z } from "zod";

export const sambaTimeEnum = z.enum([
  "LESS_THAN_1_YEAR",
  "FROM_1_TO_3_YEARS",
  "MORE_THAN_3_YEARS",
]);

export const candidateSchema = z.object({
  fullName: z.string().min(3, "Informe o nome completo"),
  artisticName: z.string().optional(),
  birthDate: z.string().min(8, "Informe a data de nascimento"),
  phoneWhatsapp: z.string().min(8, "Informe telefone/WhatsApp"),
  email: z.string().email("E-mail inválido"),
  city: z.string().min(2, "Informe cidade"),
  neighborhood: z.string().optional(),

  instagram: z.string().optional(),

  hasParticipatedBefore: z.union([z.literal("true"), z.literal("false")]),
  participatedDetails: z.string().optional(),

  sambaTime: sambaTimeEnum,
  hasLiveBatteryExp: z.union([z.literal("true"), z.literal("false")]),

  availableNightsWeekend: z.union([z.literal("true"), z.literal("false")]),
  awarePresenceRequired: z.literal("true"),

  // checkboxes
  isOver18: z.literal("true"),
  availableAllRehearsals: z.literal("true"),
  awareRepresentBlock: z.literal("true"),
  acceptedRegulation: z.literal("true"),
  authorizedImageUse: z.literal("true"),
});

export type CandidateFormInput = z.infer<typeof candidateSchema>;
