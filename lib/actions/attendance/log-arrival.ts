// lib/actions/attendance/log-arrival.ts

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "../factory/createAction";
import { AttendanceSchema } from "@/lib/validations/attendance.schema";

export const logArrival = createSafeAction(AttendanceSchema, async (data, session) => {
  const arrivedAt = new Date(`${data.missionDate}T${data.timeArrival}:00`);
  
  if (isNaN(arrivedAt.getTime())) {
    return { success: false, error: "DATE_ERROR", message: "Date de mission invalide." };
  }

  // L'idéal est de vérifier si la mission existe avant d'insérer, ou compter sur les clés étrangères
  await prisma.attendanceRecord.create({
    data: {
      missionId: data.missionId,
      employeeId: data.agentId,
      siteId: "xxx", // À mapper correctement depuis ta mission
      arrivedAt,
      createdById: session.user.id,
    },
  });

  revalidatePath("/attendance");
  return { success: true, message: "Présence enregistrée." };
});
