// prisma/seed/index.ts

import { PrismaClient } from "../../app/generated/prisma/client";
import { seedModules } from "./modules.seed";
import { seedPermissions } from "./permissions.seed";
import { seedRoles } from "./roles.seed";
import { seedUsers } from "./users.seed";

export async function runSeeders(prisma: PrismaClient) {
  // L'ORDRE EST CRUCIAL POUR LES CLÉS ÉTRANGÈRES (Foreign Keys)
  // 1. Les entités sans dépendances
  await seedModules(prisma);
  await seedPermissions(prisma);
  
  // 2. Les entités dépendantes du niveau 1
  await seedRoles(prisma);
  
  // 3. Les entités dépendantes du niveau 2
  await seedUsers(prisma);
}