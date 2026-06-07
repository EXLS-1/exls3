// components/missions/MissionForm.tsx
"use client";

import { useActionState } from "react";
import { createMissionWithEmployees, type MissionFormState } from "@/actions/missions";
import Link from "next/link";

interface MissionFormProps {
  clients: { id: string; name: string }[];
  employees: { id: string; firstName: string; lastName: string }[];
}

const initialState: MissionFormState = {};

export function MissionForm({ clients, employees }: MissionFormProps) {
  const [state, action, isPending] = useActionState(createMissionWithEmployees, initialState);

  return (
    <form action={action} className="space-y-6 bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
      
      {/* Sélection Client */}
      <div>
        <label htmlFor="clientId" className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
          Client donneur d'ordre
        </label>
        <select
          id="clientId"
          name="clientId"
          required
          disabled={isPending}
          className="block w-full rounded-lg border-0 py-2.5 text-blue-950 shadow-sm ring-1 ring-inset ring-blue-200 focus:ring-2 focus:ring-blue-700 bg-slate-50 text-sm"
        >
          <option value="">-- Choisir un client --</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Date et Heure de planification */}
      <div>
        <label htmlFor="plannedStartAt" className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
          Date & Heure de début de service
        </label>
        <input
          type="datetime-local"
          id="plannedStartAt"
          name="plannedStartAt"
          required
          disabled={isPending}
          className="block w-full rounded-lg border-0 py-2.5 text-blue-950 shadow-sm ring-1 ring-inset ring-blue-200 focus:ring-2 focus:ring-blue-700 bg-slate-50 text-sm"
        />
      </div>

      {/* Sélection des Agents (Multi-sélection simple pour rester minimaliste) */}
      <div>
        <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
          Assignation du Personnel
        </label>
        <p className="text-xs text-blue-800/50 mb-3">Maintenez Ctrl (ou Cmd) enfoncé pour sélectionner plusieurs agents.</p>
        <select
          name="employeeIds"
          multiple
          required
          size={6}
          disabled={isPending}
          className="block w-full rounded-lg border-0 py-2 text-blue-950 shadow-sm ring-1 ring-inset ring-blue-200 focus:ring-2 focus:ring-blue-700 bg-slate-50 text-sm divide-y divide-slate-100"
        >
          {employees.map((e) => (
            <option key={e.id} value={e.id} className="p-2 checked:bg-blue-600 checked:text-white">
              👮 {e.lastName.toUpperCase()} {e.firstName}
            </option>
          ))}
        </select>
      </div>

      {/* Traitement des erreurs (Alerte Rouge) */}
      {state.error && (
        <div className="rounded-lg bg-red-50 p-3 border border-red-200">
          <p className="text-sm font-semibold text-red-600">{state.error}</p>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
        <Link
          href="/attendance"
          className="px-4 py-2.5 text-sm font-semibold text-blue-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 disabled:opacity-50 transition-all"
        >
          {isPending ? "Planification..." : "Confirmer & Planifier"}
        </button>
      </div>
    </form>
  );
}