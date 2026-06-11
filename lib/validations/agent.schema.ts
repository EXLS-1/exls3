// lib/validations/agent.schema.ts
import { z } from "zod";

export const AgentSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  postnom: z.string().optional(),
  prenom: z.string().min(2, "Le prénom est requis"),
  contact1: z.string().min(10, "Contact valide requis"),
  contact2: z.string().optional(),
  dateNaissance: z.coerce.date({ required_error: "Date de naissance requise" }),
  adresseDomicile: z.string().min(5, "Adresse complète requise"),
  dateDebutService: z.coerce.date({ required_error: "Date de début requise" }),
  observation: z.string().optional(),
  // Gestion booléenne temporaire (à remplacer par URLs Document plus tard)
  formulaire: z.coerce.boolean().default(false),
  cv: z.coerce.boolean().default(false),
  carteId: z.coerce.boolean().default(false),
  diplome: z.coerce.boolean().default(false),
});