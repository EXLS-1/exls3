"use client";

import React, { useActionState, useEffect, useState, useCallback } from "react";
import { enrolAgent, type AgentFormState } from "@/app/actions/agents";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { toast } from "sonner";
import { UserPlus, Calendar, Phone, MapPin, ClipboardList, Loader2, Camera, X } from "lucide-react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/utils/crop-image";

const initialState: AgentFormState = {};

export function AgentEnrolmentForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // États pour le recadrage
  const [isCropping, setIsCropping] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  // useActionState est privilégié pour la performance et la gestion native du pending
  const [state, formAction, isPending] = useActionState(enrolAgent, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setPreviewUrl(null);
      (document.getElementById("enrol-form") as HTMLFormElement)?.reset();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state]);

  const onCropComplete = useCallback((_: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageToCrop(url);
      setIsCropping(true);
    }
  };

  const confirmCrop = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      if (croppedBlob) {
        const croppedUrl = URL.createObjectURL(croppedBlob);
        setPreviewUrl(croppedUrl);
        
        // Création d'un nouveau fichier pour l'input
        const croppedFile = new File([croppedBlob], "agent-photo.jpg", { type: "image/jpeg" });
        
        // Injection dans l'input pour que l'Action Serveur reçoive l'image recadrée
        const input = document.getElementById("photoFile") as HTMLInputElement;
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(croppedFile);
        if (input) {
          input.files = dataTransfer.files;
        }
        
        setIsCropping(false);
        setImageToCrop(null);
        toast.success("Photo ajustée avec succès");
      }
    } catch (error) {
      toast.error("Erreur lors du recadrage de l'image");
    }
  };

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
                { id: "photoPp", label: "Photo PP" },
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

          {/* Section 4: Observations */}
          <div className="space-y-2">
            <Label htmlFor="observation">Observations Particulières</Label>
            <textarea
              id="observation"
              name="observation"
              rows={3}
              disabled={isPending}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
              placeholder="Mentionner toute information pertinente (expériences passées, aptitudes physiques...)"
            />
          </div>

          <div className="flex items-center justify-end pt-6 border-t gap-4">
            {/* Interface de recadrage (Sheet Shadcn) */}
            <Sheet open={isCropping} onOpenChange={setIsCropping}>
              <SheetContent side="right" className="sm:max-w-xl flex flex-col h-full border-l-blue-50">
                <SheetHeader>
                  <SheetTitle className="text-blue-950 font-bold">Ajustement de la Photo</SheetTitle>
                  <CardDescription>Positionnez l'image pour un rendu optimal (Format 1:1 requis).</CardDescription>
                </SheetHeader>
                
                <div className="relative flex-grow mt-6 bg-slate-900 rounded-2xl overflow-hidden">
                  {imageToCrop && (
                    <Cropper
                      image={imageToCrop}
                      crop={crop}
                      zoom={zoom}
                      aspect={1 / 1}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  )}
                </div>

                <div className="py-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">Zoom</Label>
                    <input 
                      type="range" 
                      min={1} max={3} step={0.1} 
                      value={zoom} 
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>

                <SheetFooter className="gap-2 sm:gap-0">
                  <Button variant="ghost" onClick={() => setIsCropping(false)}>Annuler</Button>
                  <Button onClick={confirmCrop} className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8">
                    Valider la découpe
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>

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
