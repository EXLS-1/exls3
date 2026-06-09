// prisma/seed/roles.seed.ts

import { PrismaClient } from "../../app/generated/prisma/client";
import { generateId, seedLogger } from "./utils";

export async function seedRoles(prisma: PrismaClient) {
  seedLogger.start("Rôles");

  const roles = [
    { name: "SUPER_ADMIN", description: "Accès total au système EXCELLENT SERVICE" },
    { name: "MANAGER", description: "Accès de gestion par département" },
    { name: "EMPLOYEE", description: "Accès standard" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: {
        id: generateId(),
        name: role.name,
        description: role.description,
      },
    });
  }

  seedLogger.success("Rôles");
}