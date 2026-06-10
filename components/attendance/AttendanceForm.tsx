// components/attendance/AttendanceForm.tsx

"use client";

import React, { JSX } from "react";
import { useActionState } from "react";
import { logEmployeeArrival, type AttendanceState } from "@/app/actions/attendance";

interface AttendanceFormProps {
  missionId: string;
  employeeId: string;
  missionDate: string;
}

const initialState: AttendanceState = {};

export function AttendanceForm({ missionId, employeeId, missionDate }: AttendanceFormProps) {
  // Liaison sécurisée des identifiants à l'action serveur
  const logArrivalWithContext = logEmployeeArrival.bind(null, { 
    missionId, 
    employeeId, 
    missionDate 
  });
  
  const [state, action, isPending] = useActionState(logArrivalWithContext, initialState);

  return (
    <form action={action} className="flex items-center gap-3">
      <div className="relative">
        <label htmlFor="Date" className="sr-only">Date de la mission</label>
        <input
          id="Date"
          type="date"
          name="Date"
          required
          disabled={isPending}
          title="Entrez la date de la mission (JJ-MM-AAAA)"
          className="block w-full rounded-md border-0 py-1.5 text-blue-950 shadow-sm ring-1 ring-inset ring-blue-200 placeholder:text-blue-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6 disabled:bg-slate-50 disabled:text-slate-500"
        />
      </div>
      <div className="relative">
        <label htmlFor="timeArrival" className="sr-only">Heure d'arrivée</label>
        <input
          id="timeArrival"
          type="time"
          name="timeArrival"
          required
          disabled={isPending}
          title="Entrez l'heure d'arrivée"
          className="block w-full rounded-md border-0 py-1.5 text-blue-950 shadow-sm ring-1 ring-inset ring-blue-200 placeholder:text-blue-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6 disabled:bg-slate-50 disabled:text-slate-500"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex justify-center rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-50 transition-all"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            ...
          </span>
        ) : (
          "Valider"
        )}
      </button>

      {/* Affichage des états avec la nouvelle charte */}
      {state.error && (
        <p className="text-xs font-semibold text-red-600 animate-pulse">{state.error}</p>
      )}
      {state.success && (
        <p className="text-xs font-semibold text-blue-600">Enregistré !</p>
      )}
    </form>
  );
}