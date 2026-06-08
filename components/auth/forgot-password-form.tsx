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