// lib/validations/client.schema.ts
import { z } from "zod";

export const ResponsableSchema = z.object({
  genre: z.enum(["M", "F"]),
  nom: z.string().min(2, "Le nom est requis"),
  postnom: z.string().optional(),
  prenom: z.string().min(2, "Le prénom est requis"),
  contact1: z.string().min(10, "Contact valide requis"),
  contact2: z.string().optional(),
  adresseDomicile: z.string().min(5, "Adresse requise"),
});

export const ClientRegistrationSchema = z.object({
  companyName: z.string().min(2, "Nom de l'entreprise requis"),
  resp1_genre: z.enum(["M", "F"]).optional(),
  resp1_nom: z.string().min(2),
  resp1_prenom: z.string().min(2),
  resp1_contact1: z.string().min(10),
  // Ajoute les autres champs à mapper selon tes inputs HTML...
});