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