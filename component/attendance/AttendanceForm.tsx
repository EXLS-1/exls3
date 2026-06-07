// Component/attendance/AttendanceForm.tsx
// Ce composant React est utilisé pour afficher un formulaire permettant aux employés de saisir leur heure d'arrivée pour une mission spécifique. Il utilise la fonction logEmployeeArrival définie dans attendance.ts pour traiter les données du formulaire côté serveur.
// Le composant reçoit les props missionId, employeeId et missionDate, qui sont nécessaires pour identifier la mission et l'employé concernés. Ces données sont transmises au serveur via des champs cachés dans le formulaire.
// Le composant utilise le hook useActionState pour gérer l'état de l'action logEmployeeArrival, ce qui permet d'afficher des messages de succès ou d'erreur en fonction du résultat de l'action. Il gère également l'état de chargement pour désactiver le formulaire pendant le traitement de la soumission.
// Importations nécessaires pour le composant AttendanceForm
// - useActionState : pour gérer l'état de l'action côté client
// - logEmployeeArrival : la fonction d'action qui traite les données du formulaire côté serveur et interagit avec la base de données pour enregistrer l'heure d'arrivée de l'employé.

"use client";

import { useActionState } from "react";
import { logEmployeeArrival, type AttendanceState } from "@/actions/attendance";

interface AttendanceFormProps {
  missionId: string;
  employeeId: string;
  missionDate: string;
}

const initialState: AttendanceState = {};

export function AttendanceForm({ missionId, employeeId, missionDate }: AttendanceFormProps) {
  const [state, action, isPending] = useActionState(logEmployeeArrival, initialState);

  return (
    <form action={action} className="flex items-center gap-3">
      {/* Champs cachés pour transmettre les IDs au serveur */}
      <input type="hidden" name="missionId" value={missionId} />
      <input type="hidden" name="employeeId" value={employeeId} />
      <input type="hidden" name="missionDate" value={missionDate} />

      <div className="relative">
        <input
          type="time"
          name="timeArrival"
          required
          disabled={isPending}
          className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 disabled:bg-zinc-50 disabled:text-zinc-500"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:opacity-50 transition-all"
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

      {state.error && (
        <p className="text-xs font-medium text-red-600 animate-pulse">{state.error}</p>
      )}
      {state.success && (
        <p className="text-xs font-medium text-green-600">Enregistré !</p>
      )}
    </form>
  );
}