// lib/actions/missions/create-mission.ts

"use server";

import { generateUUIDv7 } from "@/lib/uuid";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "../factory/createAction";
import { MissionSchema } from "@/lib/validations/mission.schema";
import { MissionStatus, ShiftType } from "@prisma/client";

export const createMission = createSafeAction(MissionSchema, async (data, session) => {
  const sess = session as { user: { id: string } };
  await prisma.mission.create({
    data: {
      id: generateUUIDv7(),
      creePar: sess.user.id,
      clientId: data.clientId,
      siteId: data.siteId,
      shift: data.shift as ShiftType,
      plannedStartAt: data.plannedStartAt,
      status: data.status as unknown as MissionStatus,
    },
  });

  revalidatePath("/missions");
  return { success: true, message: "Mission planifiée avec succès." };
});
