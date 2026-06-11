// components/missions/mission-table.tsx
// Ce composant affiche une table des missions avec leurs détails, y compris l'agent assigné, le site, le roulement et la période. Il utilise des composants UI personnalisés pour une meilleure expérience utilisateur et gère les états de chargement avec un squelette de table. Les données des missions sont passées en tant que props, et chaque ligne de la table est cliquable pour afficher plus d'options via un menu déroulant.
// Importations nécessaires pour le composant MissionTable
// - MissionWithRelations : type de données pour les missions avec leurs relations (employé, site, etc.)
// - ShiftDisplay : composant pour afficher le type de roulement de la mission
// - Composants UI : Card, Button, DropdownMenu, etc. pour structurer et styliser la table
// - Icônes : MapPin, User, Calendar, MoreHorizontal, Phone pour une meilleure visualisation des informations
// - cn : fonction utilitaire pour gérer les classes CSS conditionnelles
// - format : fonction de date pour formater la période de la mission en français

"use client";

import React from "react";
import { MissionWithRelations } from "@/lib/schemas/mission-schema";
import { ShiftDisplay } from "@/components/shift/shift";
import { Card } from "@/components/ui/card";
import { 
  MapPin, 
  User, 
  Calendar,
  MoreHorizontal,
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface MissionTableProps {
  missions: MissionWithRelations[];
  isLoading?: boolean;
}

export function MissionTable({ missions, isLoading }: MissionTableProps) {
  if (isLoading) return <MissionTableSkeleton />;

  return (
    <Card className="overflow-hidden border-zinc-200 shadow-sm rounded-xl bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-50/50 border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Agent</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Site / Lieu</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Roulement</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Période</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {missions.map((mission) => (
              <tr key={mission.id} className="hover:bg-zinc-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {mission.assignedEmployee?.photoPp ? ( // Assuming photoPp might exist on assignedEmployee
                        <img src={mission.assignedEmployee.photoPp} alt="Agent" className="size-full object-cover" />
                      ) : (
                        <User className="size-5 text-zinc-400" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-900 leading-tight">
                        {mission.assignedEmployee
                          ? `${mission.assignedEmployee.lastName} ${mission.assignedEmployee.firstName}`
                          : "Agent non assigné"}
                      </span>
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Phone className="size-3" /> {mission.assignedEmployee?.phone || "N/A"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-zinc-800">{mission.site.nom}</span>
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1 truncate">
                      <MapPin className="size-3" /> {mission.site.adresse}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <ShiftDisplay type={mission.shift} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <Calendar className="size-3.5 text-zinc-400" />
                    <span className="text-[12px] font-medium uppercase tracking-tight">
                      {format(new Date(mission.plannedStartAt), "dd MMM yyyy", { locale: fr })}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 rounded-lg">
                        <MoreHorizontal className="size-4 text-zinc-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-zinc-200">
                      <DropdownMenuItem className="text-sm cursor-pointer">Voir la fiche</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm cursor-pointer text-red-600 focus:text-red-600">Retirer de la mission</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function MissionTableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 w-full bg-zinc-100 animate-pulse rounded-xl border border-zinc-200/50" />
      ))}
    </div>
  );
}