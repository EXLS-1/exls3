// lib/provider/switch-provider.tsx
// Ce fichier définit le SwitchProvider, un composant React qui gère l'état d'ouverture/fermeture de la sidebar (ou tout autre composant basculant) dans l'application.
// Le SwitchProvider utilise le Context API de React pour fournir cet état et les fonctions associées à tous les composants enfants qui en ont besoin.
// En utilisant un SwitchProvider, nous centralisons la gestion de cet état de bascule, ce qui facilite la maintenance et la cohérence de l'interface utilisateur à travers l'application.
// Note : Assurez-vous que le SwitchProvider est utilisé dans un contexte client (client-side rendering) et n'utilise pas de fonctionnalités spécifiques au serveur (server-side rendering), car il gère un état d'interface utilisateur qui est pertinent uniquement pour le client.
// En résumé, SwitchProvider est un composant de contexte qui gère l'état d'ouverture de la sidebar (ou d'autres composants basculants) et fournit des fonctions pour basculer cet état à tous les composants enfants qui en ont besoin.

"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";

interface SwitchContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
}

const SwitchContext = createContext<SwitchContextType | undefined>(undefined);

export function SwitchProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const value = useMemo(() => ({
    isSidebarOpen,
    toggleSidebar: () => setIsSidebarOpen((prev) => !prev),
    setSidebar: (open: boolean) => setIsSidebarOpen(open),
  }), [isSidebarOpen]);

  return <SwitchContext.Provider value={value}>{children}</SwitchContext.Provider>;
}

export const useSwitch = () => {
  const context = useContext(SwitchContext);
  if (!context) throw new Error("useSwitch must be used within SwitchProvider");
  return context;
};