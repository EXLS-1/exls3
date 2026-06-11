// types/mission-types.ts
// Ce fichier définit les types et schémas de validation pour les missions, en utilisant Zod pour assurer la cohérence des données.
// Il inclut également des types pour les relations avec les agents et les sites, optimisés pour l'affichage dans l'UI.
// Note: Les types et schémas sont conçus pour être utilisés à la fois dans les actions serveur (ex: création de mission) et dans les composants d'affichage (ex: tableau des missions).

import { z } from "zod";
import { ShiftSchema } from "@/components/shift/shift";

/**
 * Schéma de validation pour une Mission.
 * Utilise coerce pour transformer les entrées de formulaires (string) en objets Date.
 */
export const MissionSchema = z.object({
  id: z.string().uuid().optional(),
  agentId: z.string().min(1, "L'agent est requis"),
  siteId: z.string().min(1, "Le site est requis"),
  dateDebut: z.coerce.date({
    required_error: "La date de début est requise",
    invalid_type_error: "Format de date invalide",
  }),
  dateFin: z.coerce.date().nullable().optional(),
  shift: ShiftSchema,
  status: z.enum(["PLANIFIEE", "EN_COURS", "TERMINEE", "ANNULEE"]).default("PLANIFIEE"),
  notes: z.string().max(500, "Les notes ne doivent pas dépasser 500 caractères").optional(),
});

export type MissionInput = z.infer<typeof MissionSchema>;

/**
 * Type étendu pour l'affichage incluant les relations Prisma.
 * Vise la performance en ne demandant que le nécessaire pour l'UI.
 */
export type MissionWithRelations = MissionInput & {
  id: string; // Obligatoire en sortie de DB
  agent: {
    nom: string;
    prenom: string;
    photoPp?: string | null;
    contact1: string;
  };
  site: {
    nom: string;
    adresse: string;
    ville?: string;
  };
};