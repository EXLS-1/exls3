// lib/validations/mission.schema.ts
import { z } from "zod";
import { ShiftSchema } from "@/components/shift/shift"; // Ou déplace ça dans un dossier types/

export enum MissionStatusEnum {
  PLANNED = "PLANNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export const MissionSchema = z.object({
  clientId: z.string().min(1, "Le client est requis"),
  siteId: z.string().min(1, "Le site est requis"),
  plannedStartAt: z.coerce.date({
    required_error: "La date de début est requise",
    invalid_type_error: "Format de date invalide",
  }),
  shift: ShiftSchema,
  status: z.nativeEnum(MissionStatusEnum).default(MissionStatusEnum.PLANNED),

});

export type MissionValues = z.infer<typeof MissionSchema>;
