// app/sites/new/site-creation-wrapper.tsx
// Ce composant est un wrapper pour le formulaire de création de site d'exploitation.
// Il est utilisé dans la page de création de site pour gérer la logique de redirection après la création réussie d'un site.
// Le composant utilise le hook useRouter de Next.js pour naviguer vers la liste des sites après l'enregistrement d'un nouveau site.
// Note: Ce wrapper est conçu pour être utilisé avec le composant SiteForm, qui gère le formulaire et l'action de création côté serveur.
// Importations nécessaires pour le composant SiteCreationWrapper

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SiteForm } from "@/components/sites/sites-form";

interface ClientOption {
  id: string;
  name: string;
}

export function SiteCreationWrapper({ clients }: { clients: ClientOption[] }) {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirection vers la liste des sites après un enregistrement réussi
    // revalidatePath est déjà géré dans l'Action Serveur
    router.push("/sites");
  };

  return <SiteForm clients={clients} onSuccess={handleSuccess} />;
}