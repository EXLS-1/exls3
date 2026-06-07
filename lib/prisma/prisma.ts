import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Singleton instance de PrismaClient optimisée pour Next.js 16 avec adapter-pg.
 */
const prismaClientSingleton = () => {
  // 1. Créer un pool de connexions PostgreSQL en utilisant votre variable d'environnement
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  // 2. Initialiser l'adaptateur Prisma pour PostgreSQL
  const adapter = new PrismaPg(pool);
  
  // 3. Instancier le PrismaClient en lui injectant l'adaptateur
  return new PrismaClient({
    adapter: adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Empêche la création de multiples connexions en mode développement (Hot Reload)
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;