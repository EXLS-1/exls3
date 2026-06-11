// app/actions/missions-actions.ts
// This file contains server actions related to missions, such as creating a new mission.
// It uses Prisma for database interactions and Zod for input validation.
// The createMission action validates the form data, creates a new mission in the database, and handles errors gracefully.

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { CreateMissionSchema, CreateMissionInput, MissionStatusEnum } from "@/lib/schemas/mission-schema";
import { z } from "zod";

export type MissionFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    clientId?: string[];
    siteId?: string[];
    plannedStartAt?: string[];
    shift?: string[];
    status?: string[];
  };
};

/**
 * Server Action pour créer une nouvelle mission.
 * Valide les données avec CreateMissionSchema et interagit avec Prisma.
 */
export async function createMission(
  prevState: MissionFormState,
  formData: FormData
): Promise<MissionFormState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Non autorisé. Veuillez vous connecter." };
  }

  const rawData = {
    clientId: formData.get("clientId"),
    siteId: formData.get("siteId"),
    plannedStartAt: formData.get("plannedStartAt"),
    shift: formData.get("shift"),
    status: formData.get("status") || MissionStatusEnum.PLANNED, // Default if not provided
  };

  const validatedFields = CreateMissionSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: "Données de formulaire invalides.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.mission.create({
      data: validatedFields.data,
    });

    revalidatePath("/missions"); // Revalide le cache pour la page des missions
    return { success: true };
  } catch (error) {
    console.error("[CREATE_MISSION_ERROR]", error);
    return { error: "Erreur technique lors de la création de la mission." };
  }
}