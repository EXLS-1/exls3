// actions/missions.ts

"use server";

import { MissionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const MissionSchema = z.object({
  clientId: z.string().uuid("Client invalide"),
  plannedStartAt: z.string().min(1, "La date et l'heure sont requises"),
  plannedEndAt: z.string().min(1, "La date et l'heure de fin sont requises"),
  status: z.nativeEnum(MissionStatus).optional(),
  employeeIds: z.array(z.string().uuid()).min(1, "Sélectionnez au moins un agent"),
});

export type MissionFormState = {
  error?: string;
};

export async function createMissionWithEmployees(
  prevState: MissionFormState,
  formData: FormData
): Promise<MissionFormState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Sécurité : Seuls les ADMIN et RH peuvent planifier des missions
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "HR")) {
    return { error: "Droits insuffisants pour planifier une mission." };
  }

  // Extraction et formatage des données du formulaire
  const rawEmployeeIds = formData.getAll("employeeIds").map(id => String(id));
  
  const validatedFields = MissionSchema.safeParse({
    clientId: formData.get("clientId"),
    plannedStartAt: formData.get("plannedStartAt"),
    plannedEndAt: formData.get("plannedEndAt"),
    status: formData.get("status") || "PLANNED", // Default to PLANNED if not provided
    employeeIds: rawEmployeeIds,
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors.map(e => e.message).join(", ") };
  }

  const { clientId, plannedStartAt, employeeIds } = validatedFields.data;

  try {
    // Transaction pour garantir l'atomicité de l'opération
    await prisma.$transaction(async (tx) => {
      // 1. Création de la mission
      const mission = await tx.mission.create({
        data: {
          clientId,
          plannedStartAt: new Date(plannedStartAt),
          plannedEndAt: new Date(validatedFields.data.plannedEndAt),
          status: validatedFields.data.status,
        },
      });

      // 2. Assignation des employés (Insertions multiples dans la table pivot)
      const assignmentData = employeeIds.map((empId) => ({
        missionId: mission.id,
        employeeId: empId,
      }));

      await tx.missionEmployee.createMany({
        data: assignmentData,
      });
    });

  } catch (error) {
    console.error("[CREATE_MISSION_ERROR]", error);
    return { error: "Erreur technique lors de la création de la mission." };
  }

  // Revalidation du cache pour rafraîchir le dashboard des présences
  revalidatePath("/attendance");
  revalidatePath("/missions");
  redirect("/missions"); // Redirection après succès
}
}

export async function updateMission(
  missionId: string,
  prevState: MissionFormState,
  formData: FormData
): Promise<MissionFormState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "HR")) {
    return { error: "Droits insuffisants pour modifier une mission." };
  }

  const rawEmployeeIds = formData.getAll("employeeIds").map(id => String(id));

  const validatedFields = MissionSchema.safeParse({
    clientId: formData.get("clientId"),
    plannedStartAt: formData.get("plannedStartAt"),
    plannedEndAt: formData.get("plannedEndAt"),
    status: formData.get("status"),
    employeeIds: rawEmployeeIds,
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors.map(e => e.message).join(", ") };
  }

  const { clientId, plannedStartAt, plannedEndAt, status, employeeIds } = validatedFields.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.mission.update({
        where: { id: missionId },
        data: {
          clientId,
          plannedStartAt: new Date(plannedStartAt),
          plannedEndAt: new Date(plannedEndAt),
          status,
        },
      });

      // Supprimer les anciennes assignations et créer les nouvelles
      await tx.missionEmployee.deleteMany({
        where: { missionId },
      });

      const assignmentData = employeeIds.map((empId) => ({
        missionId: missionId,
        employeeId: empId,
      }));

      await tx.missionEmployee.createMany({
        data: assignmentData,
      });
    });
  } catch (error) {
    console.error("[UPDATE_MISSION_ERROR]", error);
    return { error: "Erreur technique lors de la mise à jour de la mission." };
  }

  revalidatePath("/attendance");
  revalidatePath("/missions");
  redirect("/missions"); // Redirection vers la liste des missions après succès
}

export async function deleteMission(missionId: string): Promise<MissionFormState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "HR")) {
    return { error: "Droits insuffisants pour supprimer une mission." };
  }

  try {
    await prisma.mission.delete({
      where: { id: missionId },
    });
  } catch (error) {
    console.error("[DELETE_MISSION_ERROR]", error);
    return { error: "Erreur technique lors de la suppression de la mission." };
  }

  revalidatePath("/attendance");
  revalidatePath("/missions");
  return {};
