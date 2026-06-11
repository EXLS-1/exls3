// app/actions/attendance-actions.ts
// Ce fichier contient la logique métier pour l'enregistrement de l'heure d'arrivée d'un employé à une mission.
// Il est utilisé par le composant AttendanceForm pour traiter les données du formulaire côté serveur.

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Le schéma ne valide plus que ce que l'utilisateur saisit (l'heure)
const AttendanceInputSchema = z.object({
  timeArrival: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Heure invalide"),
});

export type AttendanceState = {
  success?: boolean;
  error?: string;
};

// Les données sensibles (missionId, etc.) sont passées via le contexte lié (bind), 
// pas par le formData qui peut être manipulé côté client.
export async function logEmployeeArrival(
  context: { missionId: string; employeeId: string; missionDate: string },
  prevState: AttendanceState,
  formData: FormData
): Promise<AttendanceState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Non autorisé. Veuillez vous connecter." };
  }

  const validatedFields = AttendanceInputSchema.safeParse({
    timeArrival: formData.get("timeArrival"),
  });

  if (!validatedFields.success) {
    return { error: "Format d'heure invalide." };
  }

  const { timeArrival } = validatedFields.data;
  const { missionId, employeeId, missionDate } = context;
  
  const arrivedAt = new Date(`${missionDate}T${timeArrival}:00`);
  if (isNaN(arrivedAt.getTime())) return { error: "Date de mission invalide." };

  try {
    await prisma.attendanceRecord.create({
      data: {
        missionId,
        employeeId,
        arrivedAt,
        createdById: session.user.id,
      },
    });
    
    revalidatePath("/attendance");
    return { success: true };
  } catch (error) {
    console.error("[ATTENDANCE_ERROR]", error);
    return { error: "Impossible d'enregistrer la présence." };
  }
}