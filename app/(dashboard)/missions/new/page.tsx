// app/(dashboard)/missions/new/page.tsx
import { prisma } from "@/lib/prisma";
import { MissionForm } from "@/components/missions/MissionForm";

export default async function NewMissionPage() {
  // Récupération simultanée des données de base
  const [clients, employees] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.employee.findWhere ? prisma.employee.findMany({ 
      where: { status: "ACTIVE" },
      orderBy: { lastName: "asc" } 
    }) : prisma.employee.findMany({ orderBy: { lastName: "asc" } })
  ]);

  return (
    <main className="flex-1 p-8 max-w-3xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-950">Planifier une Mission</h1>
        <p className="text-sm text-blue-800/60 mt-1">
          Créez un ordre de service et assignez les agents de sécurité certifiés.
        </p>
      </div>

      <MissionForm clients={clients} employees={employees} />
    </main>
  );
}