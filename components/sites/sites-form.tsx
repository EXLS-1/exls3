"use client";

import React, { useActionState, useEffect } from "react";
import { createSite, type SiteFormState } from "@/app/actions/sites";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, MapPin, Calendar, User, Building2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ClientOption {
  id: string;
  name: string;
}

interface SiteFormProps {
  clients: ClientOption[];
  onSuccess?: () => void;
}

const initialState: SiteFormState = {};

export function SiteForm({ clients, onSuccess }: SiteFormProps) {
  const [state, action, isPending] = useActionState(createSite, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success("Site créé avec succès");
      if (onSuccess) onSuccess();
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state, onSuccess]);

  return (
    <Card className="border-blue-100 shadow-sm overflow-hidden">
      <CardHeader className="bg-blue-950/5 border-b border-blue-50">
        <CardTitle className="text-blue-950 flex items-center gap-2">
          <Building2 className="size-5 text-blue-700" />
          Nouveau Site d'Exploitation
        </CardTitle>
        <CardDescription>
          Enregistrez un nouveau lieu d'exécution pour vos missions.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form action={action} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nom du Site */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-blue-900 font-bold uppercase text-[10px] tracking-widest">Nom du Site</Label>
              <div className="relative">
                <Input id="name" name="name" placeholder="Ex: Entrepôt Nord" required disabled={isPending} className="pl-9" />
                <Building2 className="absolute left-3 top-2.5 size-4 text-blue-400" />
              </div>
            </div>

            {/* Client (Propriétaire du site) */}
            <div className="space-y-2">
              <Label htmlFor="clientId" className="text-blue-900 font-bold uppercase text-[10px] tracking-widest">Client Rattaché</Label>
              <select
                id="clientId"
                name="clientId"
                required
                disabled={isPending}
                className="flex h-9 w-full items-center justify-between rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50 transition-all"
              >
                <option value="">-- Sélectionner le Client --</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Date d'ouverture */}
            <div className="space-y-2">
              <Label htmlFor="openingDate" className="text-blue-900 font-bold uppercase text-[10px] tracking-widest">Date d'ouverture</Label>
              <div className="relative">
                <Input id="openingDate" name="openingDate" type="date" required disabled={isPending} className="pl-9" />
                <Calendar className="absolute left-3 top-2.5 size-4 text-blue-400" />
              </div>
            </div>

            {/* Nom du Responsable */}
            <div className="space-y-2">
              <Label htmlFor="managerName" className="text-blue-900 font-bold uppercase text-[10px] tracking-widest">Nom du Responsable</Label>
              <div className="relative">
                <Input id="managerName" name="managerName" placeholder="Prénom Nom" required disabled={isPending} className="pl-9" />
                <User className="absolute left-3 top-2.5 size-4 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Adresse du Site */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-blue-900 font-bold uppercase text-[10px] tracking-widest">Adresse Complète</Label>
            <div className="relative">
              <Input id="address" name="address" placeholder="Rue, Ville, Code Postal" required disabled={isPending} className="pl-9" />
              <MapPin className="absolute left-3 top-2.5 size-4 text-blue-400" />
            </div>
          </div>

          {/* Messages d'erreur atomiques */}
          {state.error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold animate-in fade-in slide-in-from-top-1">
              {state.error}
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-blue-50">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl px-8 font-bold shadow-md shadow-blue-200 transition-all active:scale-95"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Enregistrement...
                </span>
              ) : (
                "Enregistrer le Site"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}