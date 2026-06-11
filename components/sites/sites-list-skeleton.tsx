// components/sites/sites-list-skeleton.tsx
// Ce composant affiche un état de chargement (skeleton) pour la liste des sites.
// Il est conçu pour être utilisé avec React Suspense afin d'améliorer l'expérience utilisateur
// pendant que les données réelles de la liste des sites sont en cours de chargement.

import React from "react";
import { Building2 } from "lucide-react";

export function SitesListSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="px-6 py-4 font-bold text-blue-950 uppercase text-[10px] tracking-widest">Site & Localisation</th>
              <th className="px-6 py-4 font-bold text-blue-950 uppercase text-[10px] tracking-widest">Client Propriétaire</th>
              <th className="px-6 py-4 font-bold text-blue-950 uppercase text-[10px] tracking-widest">Responsable Site</th>
              <th className="px-6 py-4 font-bold text-blue-950 uppercase text-[10px] tracking-widest">Date Ouverture</th>
              <th className="px-6 py-4 text-right font-bold text-blue-950 uppercase text-[10px] tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-5 bg-slate-200 rounded-lg w-24"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-xl bg-slate-100"></div>
                    <div className="h-4 bg-slate-200 rounded w-28"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="size-4 bg-slate-100 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-20"></div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="size-8 rounded-full bg-slate-100 ml-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}