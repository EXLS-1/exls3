// lib/actions/missions/create-mission.ts

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "../factory/createAction";
import { MissionSchema } from "@/lib/validations/mission.schema";
import { MissionStatus } from "@prisma/client";

export const createMission = createSafeAction(MissionSchema, async (data) => {
  await prisma.mission.create({
    data: {
      ...data,
      status:
        data.status === "CANCELED"
          ? MissionStatus.CANCELLED
          : (data.status as unknown as MissionStatus),
    },
  });

  revalidatePath("/missions");
  return { success: true, message: "Mission planifiée avec succès." };
});
