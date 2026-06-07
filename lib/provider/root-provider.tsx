// lib/provider/root-provider.tsx
// Ce fichier définit le RootProvider, un composant React qui encapsule tous les autres fournisseurs de contexte (AuthProvider, ThemeProvider, SwitchProvider) pour les rendre disponibles dans toute l'application.
// En utilisant un RootProvider, nous centralisons la gestion des contextes et simplifions l'arborescence des composants dans les pages et autres composants clients.
// Note : Assurez-vous que tous les fournisseurs de contexte utilisés dans RootProvider sont compatibles avec le rendu côté client (client-side rendering) et n'utilisent pas de fonctionnalités spécifiques au serveur (server-side rendering).
// Par exemple, AuthProvider utilise Better-Auth qui est conçu pour le client, donc il est sûr de l'inclure ici. De même, ThemeProvider et SwitchProvider doivent être conçus pour le client.
// En résumé, RootProvider est un composant de haut niveau qui regroupe tous les fournisseurs de contexte nécessaires pour l'application, assurant ainsi une gestion centralisée et cohérente de l'état global de l'application.

"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./auth-provider";
import { ThemeProvider } from "./theme-provider";
import { SwitchProvider } from "./switch-provider";

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SwitchProvider>
          {children}
        </SwitchProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}