// components/sites/sites-filters.tsx
// Ce composant client gère la barre de recherche et le filtre par client pour la liste des sites.
// Il utilise les `searchParams` de Next.js pour maintenir l'état des filtres dans l'URL,
// permettant ainsi une gestion d'état robuste et partageable.

"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, Building2, Loader2 } from "lucide-react";

interface ClientOption {
  id: string;
  name: string;
}

interface SitesFiltersProps {
  clients: ClientOption[];
}

export function SitesFilters({ clients }: SitesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const initialSearch = searchParams.get("search") || "";
  const initialClientId = searchParams.get("clientId") || "";

  const [search, setSearch] = useState(initialSearch);
  const [clientId, setClientId] = useState(initialClientId);

  // Synchroniser l'état local avec les searchParams de l'URL
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setClientId(searchParams.get("clientId") || "");
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    updateSearchParams("search", newSearch);
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClientId = e.target.value;
    setClientId(newClientId);
    updateSearchParams("clientId", newClientId);
  };

  const updateSearchParams = (key: string, value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
        <Input
          placeholder="Rechercher un site (nom, adresse, responsable)..."
          className="pl-9 pr-4 rounded-xl border-slate-200 focus-visible:ring-blue-200"
          value={search}
          onChange={handleSearchChange}
          disabled={isPending}
        />
      </div>
      <select
        className="flex h-9 items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-blue-200 disabled:opacity-50 transition-all sm:w-auto"
        value={clientId}
        onChange={handleClientChange}
        disabled={isPending}
      >
        <option value="">Tous les clients</option>
        {clients.map((client) => (<option key={client.id} value={client.id}>{client.name}</option>))}
      </select>
      {isPending && <Loader2 className="size-5 animate-spin text-blue-500" />}
    </div>
  );
}