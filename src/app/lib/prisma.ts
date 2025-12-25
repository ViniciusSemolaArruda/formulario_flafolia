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
    // NÃO quebra o build por import; só quebra quando tentar usar
    throw new Error(
      "DATABASE_URL não definida. Defina em .env.local (local) ou nas Environment Variables do deploy (Vercel/CI)."
    );
  }

  // Reaproveita pool no dev (evita abrir várias conexões)
  const pool =
    globalThis.__pgPool ??
    new Pool({
      connectionString: url,
    });

  if (process.env.NODE_ENV !== "production") globalThis.__pgPool = pool;

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });
}

/**
 * Use isso dentro de rotas/API/server actions:
 * const prisma = getPrisma()
 */
export function getPrisma() {
  if (globalThis.__prisma) return globalThis.__prisma;

  const client = createPrismaClient();

  if (process.env.NODE_ENV !== "production") globalThis.__prisma = client;

  return client;
}
