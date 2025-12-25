import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // evita recriar o client em dev (HMR)
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createAdapter() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL não definida.");
  }

  const pool = new Pool({ connectionString: url });
  return new PrismaPg(pool);
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter: createAdapter(),
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
