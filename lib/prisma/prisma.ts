import { PrismaClient } from "@prisma/client";

/**
 * Singleton instance de PrismaClient optimisée pour Next.js 16.
 * Cette approche évite d'épuiser le pool de connexions à la base de données 
 * lors du Hot Reloading en mode développement.
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

declare global {
  // Permet d'attacher l'instance au scope global de Node.js/Edge Runtime
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// On utilise l'instance globale si elle existe, sinon on en crée une nouvelle
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  // En développement, on stocke l'instance pour la réutiliser au prochain rechargement
  globalThis.prismaGlobal = prisma;
}