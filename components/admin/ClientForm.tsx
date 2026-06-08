// components/admin/ClientForm.tsx

"use client";

import { useActionState, useEffect, useRef } from "react";
import { createClient, type AdminFormState } from "@/actions/admin";

export function ClientForm() {
  const [state, action, isPending] = useActionState(createClient, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form action={action} ref={formRef} className="space-y-4 bg-white p-5 rounded-xl border border-blue-100 shadow-sm">
      <h2 className="text-sm font-bold text-blue-950 uppercase tracking-wider border-b border-slate-100 pb-2">🏢 Nouveau Client</h2>
      
      <div>
        <label className="block text-xs font-bold text-blue-900 mb-1">Nom de l'entreprise</label>
        <input type="text" name="name" required disabled={isPending} className="block w-full rounded-md border-0 py-2 text-blue-950 ring-1 ring-blue-200 focus:ring-2 focus:ring-blue-700 text-sm bg-slate-50" />
      </div>

      <div>
        <label className="block text-xs font-bold text-blue-900 mb-1">Contact / Référent</label>
        <input type="text" name="contact" disabled={isPending} className="block w-full rounded-md border-0 py-2 text-blue-950 ring-1 ring-blue-200 focus:ring-2 focus:ring-blue-700 text-sm bg-slate-50" />
      </div>

      {state.error && <p className="text-xs font-semibold text-red-600 bg-red-50 p-2 rounded">{state.error}</p>}
      {state.success && <p className="text-xs font-semibold text-blue-600 bg-blue-50 p-2 rounded">Client ajouté avec succès !</p>}

      <button type="submit" disabled={isPending} className="w-full justify-center rounded-md bg-blue-700 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 disabled:opacity-50 transition-all">
        {isPending ? "Enregistrement..." : "Ajouter le Client"}
      </button>
    </form>
  );
}