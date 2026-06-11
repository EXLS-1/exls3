// lib/actions/missions/create-mission.ts

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "../factory/createAction";
import { MissionSchema } from "@/lib/validations/mission.schema";

export const createMission = createSafeAction(MissionSchema, async (data) => {
  await prisma.mission.create({ data });

  revalidatePath("/missions");
  return { success: true, message: "Mission planifiée avec succès." };
});
