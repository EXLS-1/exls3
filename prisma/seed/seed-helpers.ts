// prisma/seed/seed-helpers.ts

import { v7 as uuidv7 } from "uuid";

// Un logger formaté pour harmoniser les sorties console
export const seedLogger = {
  start: (entityName: string) => console.log(`⏳ Seeding des ${entityName}...`),
  success: (entityName: string) => console.log(`🟢 Succès : ${entityName}`),
  error: (entityName: string, error: any) => console.error(`🔴 Erreur sur ${entityName}:`, error),
};

// Facilite la génération d'ID si vous voulez abstraire la librairie
export const generateId = () => uuidv7();