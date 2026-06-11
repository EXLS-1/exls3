// lib/validations/auth-validation.ts
// Ce fichier contient les schémas de validation pour les formulaires d'authentification, notamment la validation des champs de connexion. Ces schémas sont utilisés pour garantir que les données saisies par l'utilisateur respectent les contraintes définies, telles que le format de l'email et la longueur minimale du mot de passe. En utilisant la bibliothèque Zod, ces schémas permettent une validation robuste et facile à maintenir, assurant ainsi une meilleure expérience utilisateur et une sécurité accrue lors de la gestion des données d'authentification.
// Note: Les types inférés à partir de ces schémas peuvent être utilisés dans les composants de formulaire pour assurer une cohérence des types et faciliter le développement en TypeScript.
// Note: Les messages d'erreur personnalisés dans les schémas de validation fournissent des retours clairs et précis à l'utilisateur, améliorant ainsi l'expérience utilisateur en cas de saisie incorrecte.

import * as z from "zod";

export const signInSchema = z.object({
  email: z.string().email("Veuillez saisir un email valide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type SignInValues = z.infer<typeof signInSchema>;