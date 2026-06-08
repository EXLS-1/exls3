// lib/auth/auth.ts

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // Configuration avancée pour la production
  advanced: {
    // Force l'utilisation du préfixe __Secure- et l'attribut 'secure' en production
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  session: {
    // Optimisation de la performance (crucial pour Next.js 16)
    // Utilise un cache pour éviter de requêter Prisma à chaque micro-vérification
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
    // Durée de vie de la session (ex: 30 jours)
    expiresIn: 60 * 60 * 24 * 30,
    // Fréquence de mise à jour de la session en base de données
    freshAge: 60 * 60 * 24, // 1 jour
  },
  // Requis pour la sécurité CSRF en production
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL as string],
});
