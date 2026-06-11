// components/admin/ClientForm.tsx
// Ce composant gère le formulaire de création d'un nouveau client dans l'interface d'administration. Il utilise "use client" pour activer les fonctionnalités React côté client, notamment les hooks d'état et d'action. La fonction createClient est une action asynchrone qui traite la soumission du formulaire et gère les états de succès et d'erreur. Le formulaire est conçu pour être simple et rapide à remplir, avec des champs pour le nom de l'entreprise et un contact référent, ainsi qu'un bouton de validation qui affiche un indicateur de chargement pendant le traitement de la soumission.
// Importations nécessaires pour le composant ClientForm
// - useActionState : pour gérer l'état de l'action asynchrone liée à la soumission du formulaire
// - createClient : l'action serveur qui traite les données du formulaire et crée un nouveau client dans la base de données
// - JSX : pour typer le retour du composant en tant que JSX.Element, assurant une meilleure intégration avec TypeScript et les outils de développement React

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