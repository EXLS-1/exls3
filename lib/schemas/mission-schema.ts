// lib/schemas/mission-schema.ts
// Ce fichier définit les schémas de validation pour les missions dans l'application, en utilisant Zod pour assurer la conformité des données avec les modèles Prisma. Il inclut des types pour la création et l'affichage des missions, en tenant compte des relations avec les clients, les sites et les employés.
// Note: Les champs et les relations sont ajustés pour correspondre au modèle Prisma `Mission` fourni, en tenant compte des différences entre les schémas de validation et les modèles de données.
// Les types d'affichage sont conçus pour être performants en ne demandant que les données nécessaires pour l'interface utilisateur, tout en respectant les relations définies dans le modèle Prisma.
// Le schéma de validation pour la création d'une mission omet les champs générés automatiquement ou non pertinents pour l'entrée initiale, tandis que le type d'affichage inclut les relations nécessaires pour une présentation complète des données de la mission.
// Note: Les champs `dateFin` et `notes` ne sont pas inclus dans le schéma de validation car ils ne sont pas des champs directs du modèle `Mission` dans Prisma. Si ces champs sont nécessaires pour la logique métier, ils devraient être gérés séparément ou ajoutés au modèle Prisma si approprié.
// Note: Le champ `agentId` du schéma de validation précédent est remplacé par `clientId` pour correspondre au modèle Prisma `Mission`, qui fait référence à un client plutôt qu'à un agent. De plus, le champ `dateDebut` est remplacé par `plannedStartAt` pour correspondre au champ de date de début prévu dans le modèle Prisma.

import { z } from "zod";
import { ShiftSchema } from "@/components/shift/shift";

/**
 * Enum pour les statuts de mission, correspondant au modèle Prisma.
 */
export enum MissionStatusEnum {
  PLANNED = "PLANNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

/**
 * Schéma de validation pour une Mission.
 * Utilise coerce pour transformer les entrées de formulaires (string) en objets Date.
 *
 * Note:
 * - `agentId` du schéma précédent est remplacé par `clientId` pour correspondre au modèle Prisma `Mission`.
 * - `dateDebut` est remplacé par `plannedStartAt` pour correspondre au modèle Prisma `Mission`.
 * - `dateFin` et `notes` ne sont pas des champs directs du modèle `Mission` dans Prisma,
 *   ils sont donc omis de ce schéma pour la création/mise à jour directe de la mission.
 */
export const MissionSchema = z.object({
  id: z.string().uuid().optional(),
  clientId: z.string().min(1, "Le client est requis"),
  siteId: z.string().min(1, "Le site est requis"),
  plannedStartAt: z.coerce.date({
    required_error: "La date de début est requise",
    invalid_type_error: "Format de date invalide",
  }),
  shift: ShiftSchema,
  status: z.nativeEnum(MissionStatusEnum).default(MissionStatusEnum.PLANNED),
  // notes: z.string().max(500, "Les notes ne doivent pas dépasser 500 caractères").optional(), // Non présent dans le modèle Prisma Mission
});

/**
 * Schéma spécifique pour la création d'une mission,
 * excluant les champs générés ou non pertinents pour l'entrée initiale.
 */
export const CreateMissionSchema = MissionSchema.omit({ id: true });

export type MissionInput = z.infer<typeof MissionSchema>;
export type CreateMissionInput = z.infer<typeof CreateMissionSchema>;

/**
 * Type étendu pour l'affichage incluant les relations Prisma.
 * Vise la performance en ne demandant que le nécessaire pour l'UI.
 *
 * Note:
 * - `client` remplace `agent` pour correspondre au `clientId` du modèle `Mission`.
 * - `assignedEmployee` est ajouté pour représenter l'agent assigné,
 *   en supposant qu'une mission peut avoir un agent principal pour l'affichage.
 *   Les champs `photoPp` et `contact1` sont issus du modèle `Agent` dans votre `schema.prisma`,
 *   mais `Mission` est lié à `Employee`. Il y a une incohérence ici.
 *   Pour l'affichage, je vais utiliser les champs de `Employee` (`firstName`, `lastName`, `phone`).
 *   Si `photoPp` est nécessaire, il faudrait l'ajouter au modèle `Employee` ou le récupérer via une autre relation.
 */
export type MissionWithRelations = Omit<MissionInput, 'clientId' | 'plannedStartAt'> & {
  id: string;
  plannedStartAt: Date;
  client: {
    name: string;
    contact?: string | null;
  };
  site: { // Correspond au siteId dans le modèle Mission
    nom: string;
    adresse: string;
    ville?: string;
  };
  assignedAgent?: { // Représente l'employé principal assigné à la mission pour l'affichage
    id: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    photoPp?: string | null; // Assumons que ce champ est disponible sur l'Employee ou via une jointure
  } | null;
};