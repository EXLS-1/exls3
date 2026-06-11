// prisma/seed.ts
// Ce fichier est le point d'entrée principal pour le processus de seeding de la base de données.
// Il utilise Prisma Client pour interagir avec la base de données et délègue toute la logique métier à l'orchestrateur de seeding.
// L'objectif est de centraliser le lancement du processus de seeding et de gérer les erreurs globales.

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { runSeeders } from "./seed";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Début du processus global de seeding...");
  try {
    // On délègue toute la logique métier à l'orchestrateur
    await runSeeders(prisma);
    console.log("✅ Processus global terminé avec succès !");
  } catch (error) {
    console.error("❌ Échec critique lors du seeding global :", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();