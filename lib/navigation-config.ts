// lib/navigation-config.ts
import { Clock, Users, Settings, Briefcase } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Adaptez les rôles selon votre schéma Prisma/Better-Auth
export type UserRole = "ADMIN" | "HR" | "AGENT"; 

export interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[]; // Si le tableau est vide, accessible à tous
}

export const MENU_ITEMS: MenuItem[] = [
  { title: "Présences & Pointage", href: "/attendance", icon: Clock, roles: ["ADMIN", "HR", "AGENT"] },
  { title: "Gestion des Missions", href: "/missions", icon: Briefcase, roles: ["ADMIN", "HR"] },
  { title: "Agents & Personnel", href: "/employees", icon: Users, roles: ["ADMIN", "HR"] },
  { title: "Configuration", href: "/settings", icon: Settings, roles: ["ADMIN"] },
];