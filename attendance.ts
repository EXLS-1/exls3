"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const AttendanceSchema = z.object({
  missionId: z.string().uuid(),
  employeeId: z.string().uuid(),
  missionDate: z.string(), // Format YYYY-MM-DD
  timeArrival: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Heure invalide"),
});

export type AttendanceState = {
  success?: boolean;
  error?: string;
};

export async function logEmployeeArrival(
  prevState: AttendanceState,
  formData: FormData
): Promise<AttendanceState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Vous devez être connecté pour effectuer cette action." };
  }

  const validatedFields = AttendanceSchema.safeParse({
    missionId: formData.get("missionId"),
    employeeId: formData.get("employeeId"),
    missionDate: formData.get("missionDate"),
    timeArrival: formData.get("timeArrival"),
  });

  if (!validatedFields.success) {
    return { error: "Données de formulaire invalides." };
  }

  const { missionId, employeeId, missionDate, timeArrival } = validatedFields.data;
  const arrivedAt = new Date(`${missionDate}T${timeArrival}:00`);

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
  } catch (e) {
    return { error: "Erreur lors de l'enregistrement en base de données." };
  }
}