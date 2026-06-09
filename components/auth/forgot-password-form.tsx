// components/auth/forgot-password-form.tsx
// Ce composant gère le formulaire de mot de passe oublié, permettant aux utilisateurs de demander un lien de réinitialisation par email.
// Il utilise react-hook-form pour la gestion du formulaire, zod pour la validation, et le client d'authentification pour envoyer la demande de réinitialisation.
// Lorsque l'utilisateur soumet le formulaire, une requête est envoyée pour générer un lien de réinitialisation. Si la demande est réussie, un message de succès est affiché. En cas d'erreur, un message d'erreur est affiché à l'utilisateur.
// Le composant gère également l'état de chargement et affiche un indicateur de chargement pendant que la requête est en cours. Si l'email a été envoyé avec succès, un message d'information est affiché pour informer l'utilisateur que s'il existe un compte associé à cet email, il recevra un lien de réinitialisation.
// Le composant est conçu pour être utilisé dans une page d'authentification, offrant une expérience utilisateur fluide pour la récupération de mot de passe.
// Note: Assurez-vous que l'URL de redirection dans la fonction `forgetPassword` correspond à la page où les utilisateurs pourront mettre à jour leur mot de passe après avoir cliqué sur le lien dans l'email.
// Importations nécessaires pour le composant
// "use client" indique que ce composant doit être rendu côté client, ce qui est nécessaire pour utiliser des hooks comme useState et useForm.
// Importation de useState pour gérer l'état local du composant, useForm pour la gestion du formulaire, zodResolver pour intégrer zod avec react-hook-form, et z pour la validation des données.
// Importation du client d'authentification pour interagir avec les fonctionnalités d'authentification, et toast pour afficher des notifications à l'utilisateur.
// Importation des composants de formulaire personnalisés et des éléments d'interface utilisateur pour construire le formulaire de mot de passe oublié.

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const forgotSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: z.infer<typeof forgotSchema>) {
    setIsLoading(true);
    const { error } = await authClient.forgetPassword({
      email: data.email,
      redirectTo: "/auth/update-password", // L'URL vers laquelle l'email pointera
    });

    if (error) {
      toast.error(error.message || "Erreur lors de l'envoi de l'email");
      setIsLoading(false);
      return;
    }
    
    setIsSent(true);
    setIsLoading(false);
    toast.success("Email de réinitialisation envoyé !");
  }

  if (isSent) {
    return (
      <div className="text-center space-y-4 py-4">
        <p className="text-sm text-zinc-600">
          Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
        </p>
        <Button variant="outline" onClick={() => setIsSent(false)} className="w-full">
          Renvoyer un email
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input type="email" placeholder="nom@excellentservice.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
          {isLoading ? <><Loader2 className="mr-2 size-4 animate-spin" /> Envoi...</> : "Envoyer le lien"}
        </Button>
      </form>
    </Form>
  );
}