// app/(dashboard)/missions/new/page.tsx
import { prisma } from "@/lib/prisma";
import { MissionForm } from "@/components/missions/Mission-form";

export default async function NewMissionPage() {
  const [clientsWithSites, employees] = await Promise.all([
    prisma.client.findMany({
      include: { sites: true }, // Chargement groupé des sites
      orderBy: { name: "asc" },
    }),
    prisma.employee.findMany({
      where: { status: "ACTIVE" },
      orderBy: { lastName: "asc" },
    }),
  ]);

  return (
    <main className="flex-1 p-8 max-w-3xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-950">Planification de Mission</h1>
        <p className="text-sm text-blue-800/60 mt-1">Liez un client à un site et assignez les agents.</p>
      </div>
      <MissionForm clients={clientsWithSites} employees={employees} />
    </main>
  );
}