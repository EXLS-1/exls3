// lib/validations/auth.ts

import * as z from "zod";

export const signInSchema = z.object({
  email: z.string().email("Veuillez saisir un email valide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type SignInValues = z.infer<typeof signInSchema>;