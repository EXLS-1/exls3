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