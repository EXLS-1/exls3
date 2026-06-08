// components/missions/MissionForm.tsx
"use client";

import { useActionState, useState, useMemo } from "react";
import { createMissionWithEmployees, type MissionFormState } from "@/actions/missions";
import Link from "next/link";

interface Site {
  id: string;
  name: string;
  clientId: string;
}

interface Client {
  id: string;
  name: string;
  sites: Site[];
}

interface MissionFormProps {
  clients: Client[];
  employees: { id: string; firstName: string; lastName: string }[];
}

export function MissionForm({ clients, employees }: MissionFormProps) {
  const [state, action, isPending] = useActionState(createMissionWithEmployees, {});
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  // Optimisation : Filtrage des sites sans nouvel appel serveur
  const availableSites = useMemo(() => {
    if (!selectedClientId) return [];
    const client = clients.find(c => c.id === selectedClientId);
    return client?.sites || [];
  }, [selectedClientId, clients]);

  return (
    <form action={action} className="space-y-6 bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sélection Client */}
        <div>
          <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
            Client
          </label>
          <select
            name="clientId"
            required
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            disabled={isPending}
            className="block w-full rounded-lg border-0 py-2.5 text-blue-950 ring-1 ring-blue-200 focus:ring-2 focus:ring-blue-700 bg-slate-50 text-sm"
          >
            <option value="">-- Sélectionner Client --</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Sélection Site (Dynamique) */}
        <div>
          <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
            Site d'exécution
          </label>
          <select
            name="siteId"
            required
            disabled={isPending || !selectedClientId}
            className="block w-full rounded-lg border-0 py-2.5 text-blue-950 ring-1 ring-blue-200 focus:ring-2 focus:ring-blue-700 bg-slate-50 text-sm disabled:opacity-50 disabled:bg-slate-100"
          >
            <option value="">
              {!selectedClientId ? "Choisir un client d'abord" : "-- Choisir le Site --"}
            </option>
            {availableSites.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Date et Heure */}
      <div>
        <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
          Début de service
        </label>
        <input
          type="datetime-local"
          name="plannedStartAt"
          required
          disabled={isPending}
          className="block w-full rounded-lg border-0 py-2.5 text-blue-950 ring-1 ring-blue-200 focus:ring-2 focus:ring-blue-700 bg-slate-50 text-sm"
        />
      </div>

      {/* Agents */}
      <div>
        <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
          Assignation des Agents (Multiple)
        </label>
        <select
          name="employeeIds"
          multiple
          required
          size={5}
          disabled={isPending}
          className="block w-full rounded-lg border-0 text-blue-950 ring-1 ring-blue-200 focus:ring-2 focus:ring-blue-700 bg-slate-50 text-sm"
        >
          {employees.map(e => (
            <option key={e.id} value={e.id} className="p-2 border-b border-slate-100 last:border-0 checked:bg-blue-600 checked:text-white">
              👮 {e.lastName.toUpperCase()} {e.firstName}
            </option>
          ))}
        </select>
      </div>

      {/* Etat d'erreur (Rouge) */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
          <p className="text-xs font-bold text-red-600">{state.error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Link href="/attendance" className="text-sm font-bold text-blue-900 px-4 py-2 hover:bg-slate-50 rounded-lg transition-all">
          Annuler
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-800 disabled:opacity-50 transition-all"
        >
          {isPending ? "Traitement..." : "Créer l'Ordre de Service"}
        </button>
      </div>
    </form>
  );
}