/**
 * components/shift/shift.tsx
 * Ce module centralise la logique de sélection et de présentation des shifts (roulements)
 * pour les missions des agents au sein de l'ERP EXCELLENT SERVICE.
 * 
 * Il propose une approche atomique avec :
 * 1. Des constantes typées pour la robustesse.
 * 2. Un schéma Zod pour la validation côté serveur et client.
 * 3. Un composant de sélection (ShiftSelector) compatible avec react-hook-form.
 * 4. Un composant de présentation (ShiftDisplay) pour l'affichage dans les tableaux et fiches missions.
 */

"use client";

import React from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sun, Moon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";

// --- Configuration des Shifts ---

export const SHIFT_TYPES = {
  DAY_12H: "12H_JOUR",
  NIGHT_12H: "12H_SOIR",
  FULL_24H: "24H",
} as const;

export type ShiftType = (typeof SHIFT_TYPES)[keyof typeof SHIFT_TYPES];

// Schéma Zod pour intégration immédiate dans les schémas de missions
export const ShiftSchema = z.nativeEnum(SHIFT_TYPES, {
  errorMap: () => ({ message: "Veuillez sélectionner un type de shift valide." }),
});

export const SHIFT_OPTIONS = [
  {
    value: SHIFT_TYPES.DAY_12H,
    label: "12H (Jour)",
    icon: Sun,
    description: "Service de jour (06h00 - 18h00)",
    color: "text-amber-600",
    bgColor: "bg-amber-50/50",
    borderColor: "border-amber-200",
  },
  {
    value: SHIFT_TYPES.NIGHT_12H,
    label: "12H (Soir)",
    icon: Moon,
    description: "Service de nuit (18h00 - 06h00)",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50/50",
    borderColor: "border-indigo-200",
  },
  {
    value: SHIFT_TYPES.FULL_24H,
    label: "24H",
    icon: Clock,
    description: "Service continu de 24 heures",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50/50",
    borderColor: "border-emerald-200",
  },
];

// --- Composants ---

interface ShiftSelectorProps {
  control: Control<any>;
  name: string;
  label?: string;
  disabled?: boolean;
}

export function ShiftSelector({ control, name, label = "Type de Shift", disabled }: ShiftSelectorProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-sm font-bold text-zinc-900 uppercase tracking-wide">{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
            <FormControl>
              <SelectTrigger className="h-12 border-zinc-200 bg-white focus:ring-2 focus:ring-zinc-900 transition-all rounded-xl">
                <SelectValue placeholder="Choisir le roulement..." />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="rounded-xl p-1">
              {SHIFT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="rounded-lg py-3 focus:bg-zinc-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", opt.bgColor)}>
                      <opt.icon className={cn("size-4", opt.color)} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-zinc-900">{opt.label}</span>
                      <span className="text-[11px] text-zinc-500 leading-none mt-1">{opt.description}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-[11px] font-medium" />
        </FormItem>
      )}
    />
  );
}

export function ShiftDisplay({ type, className }: { type: ShiftType; className?: string }) {
  const config = SHIFT_OPTIONS.find((o) => o.value === type);
  if (!config) return null;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tighter shadow-sm",
      config.bgColor,
      config.color,
      config.borderColor,
      className
    )}>
      <config.icon className="size-3" strokeWidth={3} />
      {config.label}
    </div>
  );
}