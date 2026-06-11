// components/reports/ReportFilters.tsx
// Ce composant gère les filtres pour les rapports, permettant de filtrer par date et par agent.
// Il utilise les hooks de navigation de Next.js pour mettre à jour l'URL sans recharger la page, et gère une transition pour indiquer le chargement des données filtrées.
// Les filtres sont affichés dans une interface utilisateur simple et réactive, avec des styles adaptés pour une bonne expérience utilisateur.
// Les paramètres de filtre sont maintenus dans l'URL, ce qui permet de partager facilement les liens vers des rapports filtrés.

"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

interface ReportFiltersProps {
  employees: { id: string; name: string }[];
  currentDate: string;
  currentEmployeeId: string;
}

export function ReportFilters({ employees, currentDate, currentEmployeeId }: ReportFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateUrl = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value); else params.delete(name);
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [searchParams, pathname, router]);

  return (
    <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm flex flex-col sm:flex-row gap-4 items-end">
      <div className={`flex flex-col sm:flex-row gap-4 flex-1 ${isPending ? 'opacity-50' : ''} transition-opacity`}>
        
        {/* Date unique */}
        <div className="flex-1">
          <label className="block text-xs font-bold text-blue-900 uppercase mb-1.5">Filtrer par Date</label>
          <input type="date" value={currentDate} onChange={(e) => updateUrl("date", e.target.value)} className="block w-full rounded-md border-0 py-2 text-blue-950 ring-1 ring-blue-200 text-sm bg-slate-50 focus:ring-blue-700" />
        </div>

        {/* Sélection Agent */}
        <div className="flex-1">
          <label className="block text-xs font-bold text-blue-900 uppercase mb-1.5">Filtrer par Agent</label>
          <select value={currentEmployeeId} onChange={(e) => updateUrl("employeeId", e.target.value)} className="block w-full rounded-md border-0 py-2 text-blue-950 ring-1 ring-blue-200 text-sm bg-slate-50 focus:ring-blue-700">
            <option value="">-- Tous les agents --</option>
            {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
      </div>

      {(searchParams.has("date") || searchParams.has("employeeId")) && (
        <button onClick={() => startTransition(() => router.push(pathname))} className="bg-red-50 text-red-600 ring-1 ring-red-200 px-4 py-2 rounded-md font-semibold text-sm hover:bg-red-100 transition-colors">
          Effacer
        </button>
      )}
    </div>
  );
}