// lib/auth/auth-client.ts
// Ce fichier encapsule la configuration du client d'authentification Better-Auth
// pour une utilisation facile dans toute l'application.

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL, // URL de base de ton application
});