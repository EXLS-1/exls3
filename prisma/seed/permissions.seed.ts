// prisma/seed/permissions.seed.ts

import { PrismaClient } from "../../app/generated/prisma/client";
import { generateId, seedLogger } from "./utils";

export async function seedPermissions(prisma: PrismaClient) {
  seedLogger.start("Permissions");

  const permissions = [
    { action: "read:users", description: "Voir la liste des utilisateurs" },
    { action: "write:users", description: "Créer/Modifier des utilisateurs" },
    { action: "delete:users", description: "Supprimer des utilisateurs" },
    // Ajoutez vos permissions spécifiques à Better-Auth/ERP ici
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { action: perm.action },
      update: { description: perm.description },
      create: {
        id: generateId(),
        action: perm.action,
        description: perm.description,
      },
    });
  }

  seedLogger.success("Permissions");
}