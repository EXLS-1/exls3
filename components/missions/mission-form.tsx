// components/missions/mission-form.tsx
// Composant de formulaire pour la création et l'édition de missions.
// Utilise React Hook Form pour la gestion du formulaire et Zod pour la validation.
// Intègre des composants UI personnalisés pour une meilleure expérience utilisateur.
// Les données sont envoyées à une Server Action qui gère la création de la mission dans la base de données.

"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateMissionSchema, CreateMissionInput, MissionStatusEnum } from "@/lib/schemas/mission-schema";
import { createMission } from "@/app/actions/missions-actions";
import { ShiftSelector } from "@/components/shift/shift";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Briefcase, Building2, User2, CalendarDays } from "lucide-react";

interface MissionFormProps {
  clients: { id: string; name: string }[];
  sites: { id: string; nom: string }[];
  onSuccess?: () => void;
}

/**
 * Composant MissionForm
 * Gère la création d'une mission avec validation Zod et Server Actions.
 */
export function MissionForm({ clients, sites, onSuccess }: MissionFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateMissionInput>({
    resolver: zodResolver(CreateMissionSchema),
    defaultValues: {
      clientId: "",
      siteId: "",
      plannedStartAt: new Date(),
      status: MissionStatusEnum.PLANNED,
    },
  });

  async function onSubmit(data: CreateMissionInput) {
    startTransition(async () => {
      // Conversion de l'objet typé en FormData pour l'action serveur
      const formData = new FormData();
      formData.append("clientId", data.clientId);
      formData.append("siteId", data.siteId);
      formData.append("plannedStartAt", data.plannedStartAt.toISOString());
      formData.append("shift", data.shift);
      formData.append("status", data.status);

      const result = await createMission({}, formData);

      if (result.success) {
        toast.success("Mission planifiée avec succès");
        form.reset();
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error || "Une erreur est survenue");
        // Injection des erreurs de champs si l'action serveur en renvoie
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([key, messages]) => {
            form.setError(key as keyof CreateMissionInput, { message: messages?.[0] });
          });
        }
      }
    });
  }

  return (
    <Card className="border-zinc-200 shadow-xl rounded-2xl overflow-hidden bg-white">
      <CardHeader className="bg-zinc-950 text-white p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Briefcase className="size-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">Nouvelle Mission</CardTitle>
            <CardDescription className="text-zinc-400">Assignez un agent et un roulement à un site client.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sélection du Client */}
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-bold text-xs uppercase text-zinc-500 tracking-widest"><User2 className="size-3"/> Client</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl h-11 border-zinc-200">
                          <SelectValue placeholder="Sélectionner un client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sélection du Site */}
              <FormField
                control={form.control}
                name="siteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-bold text-xs uppercase text-zinc-500 tracking-widest"><Building2 className="size-3"/> Site d'intervention</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl h-11 border-zinc-200">
                          <SelectValue placeholder="Sélectionner un site" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        {sites.map((s) => <SelectItem key={s.id} value={s.id}>{s.nom}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Date de début */}
              <FormField
                control={form.control}
                name="plannedStartAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-bold text-xs uppercase text-zinc-500 tracking-widest"><CalendarDays className="size-3"/> Date et heure</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        className="rounded-xl h-11 border-zinc-200"
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                        value={field.value ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Composant ShiftSelector Atomique */}
              <ShiftSelector control={form.control} name="shift" />
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full md:w-auto px-10 h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold shadow-lg shadow-zinc-200 transition-all active:scale-95"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" /> Planification...
                  </span>
                ) : "Créer la mission"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}