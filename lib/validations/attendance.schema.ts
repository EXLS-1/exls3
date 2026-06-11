// lib/validations/attendance.schema.ts
import { z } from "zod";

export const AttendanceSchema = z.object({
  timeArrival: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format d'heure invalide (HH:MM)"),
  missionId: z.string().uuid("Mission invalide"),
  agentId: z.string().uuid("Agent invalide"),
  missionDate: z.coerce.date({ required_error: "Date de mission requise" }),    
  status: z.enum(["PRESENT", "ABSENT", "LATE"]).default("PRESENT"),
  observation: z.string().max(255, "L'observation ne peut pas dépasser 255 caractères").optional(),
}); 

export type AttendanceValues = z.infer<typeof AttendanceSchema>;