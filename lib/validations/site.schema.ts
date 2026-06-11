// lib/validations/site.schema.ts

import { z } from "zod";

export const SiteSchema = z.object({
  name: z.string().min(2, "Le nom du site est requis"),
  openingDate: z.coerce.date({ required_error: "La date d'ouverture est requise" }),
  address: z.string().min(5, "L'adresse complète est requise"),
  clientId: z.string().uuid("Client invalide"),
  managerName: z.string().min(2, "Le nom du responsable est requis"),
});

export type SiteValues = z.infer<typeof SiteSchema>;
