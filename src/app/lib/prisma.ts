// src/app/lib/prisma.ts
import "server-only";
import { PrismaClient } from "../../../generated/prisma";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      "DATABASE_URL não definida. Defina em .env/.env.local (local) ou nas Environment Variables do deploy (Vercel/CI)."
    );
  }

  const pool =
    global.__pgPool ??
    new Pool({
      connectionString: url,
      // opcional: evita erro de SSL em alguns providers (Neon, Supabase, etc.)
      // ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
    });

  if (process.env.NODE_ENV !== "production") global.__pgPool = pool;

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });
}

export const prisma = global.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;
