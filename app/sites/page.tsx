// app/sites/new/page.tsx
// Page de création d'un nouveau site d'exploitation.
// Récupère la liste des clients côté serveur pour alimenter le formulaire.

import React from "react";
import { prisma } from "@/lib/prisma";
import { SiteForm } from "@/components/sites/sites-form";
import { Building2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteCreationWrapper } from "./new/site-creation-wrapper";

export default async function NewSitePage() {
  // Récupération des clients pour le select du formulaire
  const clients = await prisma.client.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="container max-w-4xl mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/sites">
              <ChevronLeft className="size-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-blue-950 tracking-tight">Configuration Site</h1>
            <p className="text-sm text-slate-500 font-medium">Ajouter un nouveau point d'exploitation</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-2 border border-slate-100 shadow-sm">
        <SiteCreationWrapper clients={clients} />
      </div>
    </div>
  );
}
