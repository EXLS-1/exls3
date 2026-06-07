// actions/missions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const CreateMissionSchema = z.object({
  clientId: z.string().uuid("Client invalide"),
  siteId: z.string().uuid("Site d'exécution invalide"), // Nouveau champ
  plannedStartAt: z.string().min(1, "Date requise"),
  employeeIds: z.array(z.string().uuid()).min(1, "Assignez au moins un agent"),
});

export type MissionFormState = { error?: string };

export async function createMissionWithEmployees(
  prevState: MissionFormState,
  formData: FormData
): Promise<MissionFormState> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "HR")) {
    return { error: "Accès refusé." };
  }

  const validatedFields = CreateMissionSchema.safeParse({
    clientId: formData.get("clientId"),
    siteId: formData.get("siteId"), // Capture du site
    plannedStartAt: formData.get("plannedStartAt"),
    employeeIds: formData.getAll("employeeIds").map(id => String(id)),
  });

  if (!validatedFields.success) return { error: "Données invalides." };

  const { clientId, siteId, plannedStartAt, employeeIds } = validatedFields.data;

  try {
    await prisma.$transaction(async (tx) => {
      const mission = await tx.mission.create({
        data: {
          clientId,
          siteId, // Liaison au site
          plannedStartAt: new Date(plannedStartAt),
          status: "PLANNED",
        },
      });

      await tx.missionEmployee.createMany({
        data: employeeIds.map(empId => ({
          missionId: mission.id,
          employeeId: empId,
        })),
      });
    });
  } catch (error) {
    return { error: "Erreur technique lors de la création." };
  }

  revalidatePath("/attendance");
  redirect("/attendance");
}