"use client";

import React, { useActionState, useEffect } from "react";
import { registerClient, type ClientFormState } from "@/app/actions/clients";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserCheck, Users, MapPin, Phone, Building, Loader2, ShieldCheck } from "lucide-react";

const initialState: ClientFormState = {};

export function ClientRegistrationForm() {
  const [state, formAction, isPending] = useActionState(registerClient, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      (document.getElementById("client-form") as HTMLFormElement)?.reset();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state]);

  const ResponsableFields = ({ title, prefix, icon: Icon }: { title: string; prefix: string; icon: any }) => (
    <div className="space-y-4 p-6 rounded-2xl bg-slate-50/50 border border-slate-100">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 rounded-lg bg-white shadow-sm">
          <Icon className="size-4 text-blue-600" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-blue-950">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Genre</Label>
          <Select name={`${prefix}_genre`} defaultValue="M">
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Masculin</SelectItem>
              <SelectItem value="F">Féminin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Nom</Label>
          <Input name={`${prefix}_nom`} placeholder="Nom" required disabled={isPending} className="bg-white" />
        </div>
        <div className="space-y-2">
          <Label>Postnom</Label>
          <Input name={`${prefix}_postnom`} placeholder="Postnom" disabled={isPending} className="bg-white" />
        </div>
        <div className="space-y-2">
          <Label>Prénom</Label>
          <Input name={`${prefix}_prenom`} placeholder="Prénom" required disabled={isPending} className="bg-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><Phone className="size-3" /> Contact 1</Label>
          <Input name={`${prefix}_contact1`} type="tel" placeholder="+243..." required disabled={isPending} className="bg-white" />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><Phone className="size-3 text-slate-400" /> Contact 2</Label>
          <Input name={`${prefix}_contact2`} type="tel" placeholder="+243..." disabled={isPending} className="bg-white" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2"><MapPin className="size-3" /> Adresse Domicile</Label>
        <Input name={`${prefix}_adresse`} placeholder="Adresse complète" required disabled={isPending} className="bg-white" />
      </div>
    </div>
  );

  return (
    <form id="client-form" action={formAction}>
      <Card className="border-none shadow-2xl bg-white overflow-hidden">
        <CardHeader className="bg-blue-950 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-900 rounded-2xl">
              <Building className="size-8 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Enregistrement Client</CardTitle>
              <CardDescription className="text-blue-200/60">
                Configuration des responsables et des accès de secours.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Nom de l'entité */}
          <div className="max-w-md space-y-2">
            <Label htmlFor="companyName" className="text-blue-900 font-bold uppercase text-[10px] tracking-widest">
              Désignation / Nom de l'Entreprise
            </Label>
            <div className="relative">
              <Input 
                id="companyName" 
                name="companyName" 
                placeholder="Ex: SARL EXCELLENCE" 
                required 
                disabled={isPending} 
                className="pl-10 h-12 text-lg font-semibold border-slate-200 focus:ring-blue-500 rounded-xl"
              />
              <ShieldCheck className="absolute left-3 top-3.5 size-5 text-blue-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <ResponsableFields 
              title="Responsable Principal (R1)" 
              prefix="resp1" 
              icon={UserCheck} 
            />
            <ResponsableFields 
              title="Responsable Remplaçant (R2)" 
              prefix="resp2" 
              icon={Users} 
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              className="rounded-xl px-8 border-slate-200 text-slate-600 hover:bg-slate-50"
              onClick={() => (document.getElementById("client-form") as HTMLFormElement)?.reset()}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl px-12 font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                "Enregistrer le Client"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
