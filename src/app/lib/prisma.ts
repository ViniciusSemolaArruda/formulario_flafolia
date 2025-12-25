// src/app/lib/prisma.ts
import "server-only";
import { PrismaClient } from "../../../generated/prisma";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL;

  // Não dá pra conectar sem URL — mas a mensagem fica clara
  if (!url) {
    throw new Error(
      "DATABASE_URL não definida. Defina em .env.local (local) ou nas Environment Variables do deploy (Vercel/CI)."
    );
  }

  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });
}

export const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;