// lib/provider/theme-provider.tsx
// Ce fichier définit le ThemeProvider, un composant React qui utilise la bibliothèque next-themes pour gérer les thèmes (clair/sombre) dans l'application.
// Le ThemeProvider utilise le Context API de React pour fournir les fonctionnalités de thème à tous les composants enfants qui en ont besoin.
// En utilisant un ThemeProvider, nous centralisons la gestion du thème, ce qui facilite la maintenance et la cohérence de l'interface utilisateur à travers l'application.
// Note : Assurez-vous que le ThemeProvider est utilisé dans un contexte client (client-side rendering) et n'utilise pas de fonctionnalités spécifiques au serveur (server-side rendering), car il gère un état d'interface utilisateur qui est pertinent uniquement pour le client.
// En résumé, ThemeProvider est un composant de contexte qui gère les thèmes de l'application et fournit des fonctionnalités pour basculer entre les thèmes à tous les composants enfants qui en ont besoin.

"use client"; // 👈 OBLIGATOIRE : Force l'exécution côté client

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

// Typage professionnel et extensible pour les props du provider
type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}