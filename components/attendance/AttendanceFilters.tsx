// components/attendance/AttendanceFilters.tsx
// Ce composant gère les filtres de date et de mission pour la page d'assiduité. Il utilise les hooks de navigation de Next.js pour mettre à jour l'URL sans recharger la page, ce qui permet une expérience utilisateur fluide. Le composant affiche également un indicateur de chargement subtil pendant que les données sont mises à jour côté serveur, et un bouton de réinitialisation pour revenir aux filtres par défaut.
// Utilise "use client" pour activer les fonctionnalités React côté client, notamment les hooks d'état et de transition.
// Les fonctions handleFilterChange et handleReset utilisent startTransition pour garantir que l'interface reste réactive pendant les mises à jour de l'URL, en évitant les blocages de l'interface utilisateur lors des requêtes serveur.
// Importations nécessaires pour le composant AttendanceFilters
// - useRouter, usePathname, useSearchParams : pour gérer la navigation et les paramètres d'URL de manière fluide
// - useCallback, useTransition : pour optimiser les fonctions de gestion des filtres et maintenir une interface réactive pendant les transitions

"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

interface MissionOption {
  id: string;
  label: string;
}

interface AttendanceFiltersProps {
  initialDate: string;
  initialMissionId: string;
  missions: MissionOption[];
}

export function AttendanceFilters({
  initialDate,
  initialMissionId,
  missions,
}: AttendanceFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // useTransition permet de garder l'UI réactive pendant que le serveur traite la nouvelle URL
  const [isPending, startTransition] = useTransition();

  // Fonction utilitaire pour manipuler les paramètres d'URL proprement
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString(name, value)}`, {
        scroll: false, // Empêche la page de remonter tout en haut à chaque clic
      });
    });
  };

  const handleReset = () => {
    startTransition(() => {
      // Naviguer vers le chemin de base efface tous les paramètres (retour aux valeurs par défaut du serveur)
      router.push(pathname, { scroll: false });
    });
  };

  // On affiche le bouton de réinitialisation uniquement si des filtres modifient la vue par défaut
  const hasActiveFilters = searchParams.has("missionId") || searchParams.has("date");

  return (
    <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex flex-col md:flex-row items-center gap-4 transition-opacity">
      {/* Indicateur de chargement subtil lors des requêtes serveur */}
      <div className={`w-full flex flex-col md:flex-row gap-4 ${isPending ? 'opacity-60 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>
        
        {/* Filtre Date */}
        <div className="flex-1 w-full relative">
          <label htmlFor="date" className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5">
            Date d'opération
          </label>
          <input
            type="date"
            id="date"
            value={initialDate}
            onChange={(e) => handleFilterChange("date", e.target.value)}
            className="block w-full rounded-lg border-0 py-2.5 px-3 text-blue-950 shadow-sm ring-1 ring-inset ring-blue-200 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6 bg-slate-50 transition-all"
          />
        </div>

        {/* Filtre Mission */}
        <div className="flex-[2] w-full relative">
          <label htmlFor="mission" className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5">
            Sélectionner une mission
          </label>
          <select
            id="mission"
            value={initialMissionId}
            onChange={(e) => handleFilterChange("missionId", e.target.value)}
            className="block w-full rounded-lg border-0 py-2.5 px-3 text-blue-950 shadow-sm ring-1 ring-inset ring-blue-200 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6 bg-slate-50 transition-all"
          >
            <option value="" className="text-blue-400">
              -- Toutes les missions --
            </option>
            {missions.map((mission) => (
              <option key={mission.id} value={mission.id}>
                {mission.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bouton de réinitialisation (Action Rouge) */}
      {hasActiveFilters && (
        <div className="w-full md:w-auto md:self-end mt-4 md:mt-0 flex shrink-0">
          <button
            onClick={handleReset}
            disabled={isPending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-200 hover:bg-red-100 hover:text-red-700 focus:ring-2 focus:ring-inset focus:ring-red-600 transition-all disabled:opacity-50"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Réinitialiser
          </button>
        </div>
      )}
    </div>
  );
}