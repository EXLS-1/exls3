// lib/prisma/prisma.ts
// Some setups expose PrismaClient as a CJS default export. Import defensively to avoid
// "Module '@prisma/client' has no exported member 'PrismaClient'" TypeScript errors.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import pkg from "@prisma/client";
const { PrismaClient } = pkg as any;
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Singleton instance de PrismaClient optimisée pour Next.js 16 avec adapter-pg.
 */
const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("La variable d'environnement DATABASE_URL est manquante.");
  }

  // 1. Créer un pool de connexions optimisé
  const pool = new Pool({ 
    connectionString,
    max: 20, // Ajustez selon les limites de votre instance Supabase
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Empêche la création de multiples connexions en mode développement (Hot Reload)
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;