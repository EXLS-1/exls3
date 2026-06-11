// components/agent/agent-enrolment-form.tsx
// Formulaire d'enrôlement d'un nouvel agent avec validation, upload de photo et check-list documentaire.
// Utilise useActionState pour gérer l'état de l'action d'enrôlement et afficher les erreurs spécifiques aux champs.
// Conçu pour une expérience utilisateur fluide avec des feedbacks visuels clairs et une interface moderne.
// Note: Ce composant est destiné à être utilisé dans une application Next.js avec le support de React Server Actions et Tailwind CSS pour le style.
// Le formulaire est divisé en sections logiques pour une meilleure organisation des données et une navigation aisée.
// Importants: Assurez-vous que l'action `enrolAgent` gère correctement les fichiers et retourne des erreurs spécifiques aux champs pour une validation efficace.
// Le composant inclut également une prévisualisation de la photo sélectionnée avant l'envoi du formulaire, améliorant ainsi l'expérience utilisateur.

"use client";

import React, { useActionState, useEffect, useState, useCallback } from "react";
import { enrolAgent } from "@/lib/actions/agents/enrol-agent";
import { ActionResult } from "@/lib/actions/factory/createAction";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  UserPlus,
  Calendar,
  Phone,
  MapPin,
  ClipboardList,
  Loader2,
  Camera,
  AlertCircle,
} from "lucide-react";

const initialState: ActionResult = {
  success: false,
  error: "",
};

const DOCUMENTS = [
  { id: "formulaire", label: "Formulaire" },
  { id: "cv", label: "CV" },
  { id: "carteId", label: "Carte ID" },
  { id: "diplome", label: "Diplôme" },
] as const;

function FieldError({ errors, name }: { errors?: Record<string, string[] | undefined>; name: string }) {
  if (!errors?.[name]?.length) return null;
  return (
    <p className="text-xs font-medium text-red-600 flex items-center gap-1 mt-1.5 animate-in slide-in-from-top-1">
      <AlertCircle className="size-3" />
      {errors[name][0]}
    </p>
  );
}

export function AgentEnrolmentForm() {
  const [state, formAction, isPending] = useActionState(enrolAgent, initialState);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Toast et reset
  useEffect(() => {
    if (state.success) {
      toast.success(state.message || "Agent enrôlé avec succès.");
      const form = document.getElementById("enrol-form") as HTMLFormElement | null;
      form?.reset();
      setPreviewUrl(null);
    } else if (state.error && !isPending) {
      toast.error(state.error);
    }
  }, [state, isPending]);

  // Preview photo
  const handlePhotoChange = useCallback((e: React.ChangeEvent<<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, [previewUrl]);

  // Cleanup preview
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b pb-2">
              Identité de l'Agent
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input id="nom" name="nom" placeholder="Ex: KABANGA" required disabled={isPending} />
                <FieldError errors={state.fieldErrors} name="nom" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postnom">Postnom</Label>
                <Input id="postnom" name="postnom" placeholder="Ex: MUKENDI" disabled={isPending} />
                <FieldError errors={state.fieldErrors} name="postnom" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input id="prenom" name="prenom" placeholder="Ex: Jean" required disabled={isPending} />
                <FieldError errors={state.fieldErrors} name="prenom" />
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
                  <FieldError errors={state.fieldErrors} name="contact1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact2">Contact Secondaire</Label>
                  <Input id="contact2" name="contact2" type="tel" placeholder="+243..." disabled={isPending} />
                  <FieldError errors={state.fieldErrors} name="contact2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresseDomicile">Adresse Domicile</Label>
                <div className="relative">
                  <Input
                    id="adresseDomicile"
                    name="adresseDomicile"
                    className="pl-9"
                    placeholder="Commune, Quartier, Avenue, N°"
                    required
                    disabled={isPending}
                  />
                  <MapPin className="absolute left-3 top-2.5 size-4 text-slate-400" />
                </div>
                <FieldError errors={state.fieldErrors} name="adresseDomicile" />
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
                  <FieldError errors={state.fieldErrors} name="dateNaissance" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateDebutService">Début de Service</Label>
                  <Input id="dateDebutService" name="dateDebutService" type="date" required disabled={isPending} />
                  <FieldError errors={state.fieldErrors} name="dateDebutService" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Check-list Documentaire */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b pb-2 flex items-center gap-2">
              <ClipboardList className="size-4" /> Dossier Physique (Check-list)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {DOCUMENTS.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                >
                  <input
                    type="checkbox"
                    id={doc.id}
                    name={doc.id}
                    disabled={isPending}
                    className="size-5 rounded border-slate-300 text-blue-700 focus:ring-blue-600 cursor-pointer"
                  />
                  <Label htmlFor={doc.id} className="text-xs font-semibold cursor-pointer">
                    {doc.label}
                  </Label>
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
                onChange={handlePhotoChange}
                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <FieldError errors={state.fieldErrors} name="photoFile" />

              {previewUrl && (
                <div className="mt-3 relative size-32 rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                  <img src={previewUrl} alt="Preview" className="size-full object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="observation">Observations Particulières</Label>
              <textarea
                id="observation"
                name="observation"
                rows={3}
                disabled={isPending}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-blue-600 outline-none transition-all resize-none"
                placeholder="Mentionner toute information pertinente..."
              />
              <FieldError errors={state.fieldErrors} name="observation" />
            </div>
          </div>

          {/* Erreur globale */}
          {state.error && !state.fieldErrors && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold animate-in fade-in">
              {state.error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end pt-6 border-t gap-4">
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => {
                const form = document.getElementById("enrol-form") as HTMLFormElement | null;
                form?.reset();
                setPreviewUrl(null);
              }}
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