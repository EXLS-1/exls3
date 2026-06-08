// components/auth/update-password-form.tsx

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
import { UpdatedPasswordSuccess } from "./updated-password-success";

const updateSchema = z.object({
  newPassword: z.string().min(8, "Minimum 8 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

interface UpdatePasswordFormProps {
  token: string;
  email: string | null;
}

export function UpdatePasswordForm({ token, email }: UpdatePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(data: z.infer<typeof updateSchema>) {
    setIsLoading(true);
    // Better-Auth resetPassword
    const { error } = await authClient.resetPassword({
      newPassword: data.newPassword,
      token: token,
    });

    if (error) {
      toast.error(error.message || "Erreur lors de la mise à jour");
      setIsLoading(false);
      return;
    }
    
    setIsSuccess(true);
    setIsLoading(false);
  }

  if (isSuccess) return <UpdatedPasswordSuccess />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {email && <p className="text-sm text-zinc-500 text-center">Réinitialisation pour : <strong>{email}</strong></p>}
        <FormField control={form.control} name="newPassword" render={({ field }) => (
          <FormItem>
            <FormLabel>Nouveau mot de passe</FormLabel>
            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="confirmPassword" render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmer le mot de passe</FormLabel>
            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
          {isLoading ? <><Loader2 className="mr-2 size-4 animate-spin" /> Mise à jour...</> : "Mettre à jour"}
        </Button>
      </form>
    </Form>
  );
}