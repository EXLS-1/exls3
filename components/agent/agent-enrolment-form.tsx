// components/agent/agent-enrolment-form.tsx
// Ce composant gère l'enrôlement d'un nouvel agent avec une interface utilisateur riche et une gestion d'état optimisée.
// Utilise "use client" pour activer les fonctionnalités React côté client, notamment les hooks d'état et d'effet.
// La fonction "enrolAgent" est une action asynchrone qui traite la soumission du formulaire et gère les états de succès et d'erreur.
// Le formulaire est divisé en sections claires pour une meilleure expérience utilisateur, avec des champs d'entrée, des cases à cocher pour la check-list documentaire, et une zone de téléchargement de photo.

"use client";

import React, { useActionState, useEffect } from "react";
import { enrolAgent, type AgentFormState } from "@/app/actions/agents-actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserPlus, Calendar, Phone, MapPin, ClipboardList, Loader2, Camera } from "lucide-react";

const initialState: AgentFormState = {};

export function AgentEnrolmentForm() {
  // useActionState est privilégié pour la performance et la gestion native du pending
  const [state, formAction, isPending] = useActionState(enrolAgent, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      (document.getElementById("enrol-form") as HTMLFormElement)?.reset();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Card className="max-w-4xl mx-auto border-slate-200 shadow-xl overflow-hidden transition-all">
      <CardHeader className="bg-blue-950 text-white p-8">
        <div className="flex items-center gap-3">
          <UserPlus className="size-8 text-blue-400" />
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Enrôlement Nouvel Agent</CardTitle>
            <CardDescription className="text-blue-200/70">
              Saisie complète des données d'identification et vérification documentaire.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <form id="enrol-form" action={formAction} className="space-y-8">
          {/* Section 1: Identité */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b pb-2">Identité de l'Agent</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input id="nom" name="nom" placeholder="Ex: KABANGA" required disabled={isPending} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postnom">Postnom</Label>
                <Input id="postnom" name="postnom" placeholder="Ex: MUKENDI" disabled={isPending} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input id="prenom" name="prenom" placeholder="Ex: Jean" required disabled={isPending} />
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b pb-2 flex items-center gap-2">
                <Phone className="size-4" /> Coordonnées
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact1">Contact Principal</Label>
                  <Input id="contact1" name="contact1" type="tel" placeholder="+243..." required disabled={isPending} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact2">Contact Secondaire</Label>
                  <Input id="contact2" name="contact2" type="tel" placeholder="+243..." disabled={isPending} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresseDomicile">Adresse Domicile</Label>
                <div className="relative">
                  <Input id="adresseDomicile" name="adresseDomicile" className="pl-9" placeholder="Commune, Quartier, Avenue, N°" required disabled={isPending} />
                  <MapPin className="absolute left-3 top-2.5 size-4 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b pb-2 flex items-center gap-2">
                <Calendar className="size-4" /> Dates Clés
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateNaissance">Date Naissance</Label>
                  <Input id="dateNaissance" name="dateNaissance" type="date" required disabled={isPending} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateDebutService">Début de Service</Label>
                  <Input id="dateDebutService" name="dateDebutService" type="date" required disabled={isPending} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Check-list Documentaire [0/1] */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b pb-2 flex items-center gap-2">
              <ClipboardList className="size-4" /> Dossier Physique (Check-list)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {[
                { id: "formulaire", label: "Formulaire" },
                { id: "cv", label: "CV" },
                { id: "carteId", label: "Carte ID" },
                { id: "diplome", label: "Diplôme" },
              ].map((doc) => (
                <div key={doc.id} className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                  <input
                    type="checkbox"
                    id={doc.id}
                    name={doc.id}
                    disabled={isPending}
                    className="size-5 rounded border-slate-300 text-blue-700 focus:ring-blue-600 cursor-pointer"
                  />
                  <Label htmlFor={doc.id} className="text-xs font-semibold cursor-pointer">{doc.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Photo & Observations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="photoFile" className="flex items-center gap-2">
                <Camera className="size-4 text-blue-600" /> Photo de Profil (Numérique)
              </Label>
              <Input 
                id="photoFile" 
                name="photoFile" 
                type="file" 
                accept="image/*" 
                disabled={isPending}
                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="observation">Observations Particulières</Label>
              <textarea
                id="observation"
                name="observation"
                rows={3}
                disabled={isPending}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-blue-600 outline-none transition-all"
                placeholder="Mentionner toute information pertinente..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-6 border-t gap-4">
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => (document.getElementById("enrol-form") as HTMLFormElement)?.reset()}
            >
              Réinitialiser
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl px-12 font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enrôler l'Agent"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
