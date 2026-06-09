// prisma/seed/modules.seed.ts

import { PrismaClient } from "../../app/generated/prisma/client";
import { generateId, seedLogger } from "./utils";

export async function seedModules(prisma: PrismaClient) {
  seedLogger.start("Modules ERP");

  const modules = [
    { name: "Ressources Humaines", code: "HR" },
    { name: "Finance & Comptabilité", code: "FIN" },
    { name: "Gestion des Stocks", code: "INV" },
    { name: "Ventes & CRM", code: "CRM" },
  ];

  for (const mod of modules) {
    await prisma.module.upsert({
      where: { code: mod.code }, // Assurez-vous d'avoir @unique sur 'code' dans votre schema
      update: { name: mod.name }, // Permet de mettre à jour le nom si modifié
      create: {
        id: generateId(),
        name: mod.name,
        code: mod.code,
      },
    });
  }

  seedLogger.success("Modules ERP");
}