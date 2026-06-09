// prisma/seed/users.seed.ts

import { PrismaClient } from "../../app/generated/prisma/client";
import { generateId, seedLogger } from "./seed-helpers";

export async function seedUsers(prisma: PrismaClient) {
  seedLogger.start("Utilisateurs");

  const adminEmail = "excellentservice2exls@gmail.com";

  // Optionnel : Récupérer l'ID du rôle SUPER_ADMIN s'il s'agit d'une relation (Foreign Key)
  // const superAdminRole = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } });
  // if (!superAdminRole) throw new Error("Le rôle SUPER_ADMIN est manquant.");

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, 
    create: {
      id: generateId(),
      name: "Super Admin",
      email: adminEmail,
      // roleId: superAdminRole.id, // À adapter selon la structure Better-Auth/Schema Prisma
    },
  });

  seedLogger.success("Utilisateurs");
}