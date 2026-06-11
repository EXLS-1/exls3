// component/attendance/attendance.tsx
// Ce fichier contient la logique métier pour l'enregistrement de l'heure d'arrivée d'un employé à une mission.
// Il est utilisé par le composant AttendanceForm pour traiter les données du formulaire côté serveur.
// "use server" indique que cette fonction doit être exécutée côté serveur, ce qui permet d'accéder à la base de données et à la session utilisateur de manière sécurisée.
// La fonction logEmployeeArrival reçoit l'état précédent et les données du formulaire, valide les données, vérifie la session utilisateur, puis crée un nouvel enregistrement de présence dans la base de données. En cas de succès, elle déclenche une revalidation de la page d'attendance pour afficher les nouvelles données. En cas d'erreur, elle retourne un message d'erreur approprié.
// Importations nécessaires pour la fonction logEmployeeArrival
// - prisma : pour interagir avec la base de données
// - auth : pour vérifier la session utilisateur
// - headers : pour accéder aux en-têtes de la requête, nécessaires pour l'authentification
// - z : pour valider les données du formulaire
// - revalidatePath : pour déclencher une revalidation de la page après une mise à jour de la base de données

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const AttendanceSchema = z.object({
  missionId: z.string().uuid(),
  employeeId: z.string().uuid(),
  missionDate: z.string(), // Format YYYY-MM-DD
  timeArrival: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Heure invalide"),
});

export type AttendanceState = {
  success?: boolean;
  error?: string;
};

export async function logEmployeeArrival(
  prevState: AttendanceState,
  formData: FormData
): Promise<AttendanceState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Vous devez être connecté pour effectuer cette action." };
  }

  const validatedFields = AttendanceSchema.safeParse({
    missionId: formData.get("missionId"),
    employeeId: formData.get("employeeId"),
    missionDate: formData.get("missionDate"),
    timeArrival: formData.get("timeArrival"),
  });

  if (!validatedFields.success) {
    return { error: "Données de formulaire invalides." };
  }

  const { missionId, employeeId, missionDate, timeArrival } = validatedFields.data;
  const arrivedAt = new Date(`${missionDate}T${timeArrival}:00`);

  try {
    await prisma.attendanceRecord.create({
      data: {
        missionId,
        employeeId,
        arrivedAt,
        createdById: session.user.id,
      },
    });
    revalidatePath("/attendance");
    return { success: true };
  } catch (e) {
    return { error: "Erreur lors de l'enregistrement en base de données." };
  }
}