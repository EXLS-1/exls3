"use client";

import React from "react";
import { MissionWithRelations } from "@/lib/schemas/mission";
import { ShiftDisplay } from "@/components/shift/shift";
import { Card } from "@/components/ui/card";
import { 
  MapPin, 
  User, 
  Calendar,
  MoreHorizontal,
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";
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
                      {mission.agent.photoPp ? (
                        <img src={mission.agent.photoPp} alt="Agent" className="size-full object-cover" />
                      ) : (
                        <User className="size-5 text-zinc-400" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-900 leading-tight">
                        {mission.agent.nom} {mission.agent.prenom}
                      </span>
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Phone className="size-3" /> {mission.agent.contact1}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-zinc-800">{mission.site.nom}</span>
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
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
                    <span className="text-[12px] font-medium uppercase tracking-tighter">
                      {format(new Date(mission.dateDebut), "dd MMM yyyy", { locale: fr })}
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