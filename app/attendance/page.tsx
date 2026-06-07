import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
interface PageProps {
  searchParams: Promise<{ date?: string; missionId?: string }>;
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AttendancePage({ searchParams }: PageProps) {
  const session = await auth.api.getSession({

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const selectedDateStr = params.date || new Date().toISOString().split("T")[0];
  const selectedMissionId = params.missionId;

  // Calcul des bornes de la journée pour le filtrage Prisma
  const startOfDay = new Date(`${selectedDateStr}T00:00:00`);
  const endOfDay = new Date(`${selectedDateStr}T23:59:59`);

  // Récupération des missions pour la date sélectionnée (pour le sélecteur)
  const dayMissions = await prisma.mission.findMany({
    where: {
      plannedStartAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      client: true,
    },
    orderBy: {
      plannedStartAt: "asc",
    },
  });

  // Si une mission est sélectionnée, on récupère les détails et le personnel
  const activeMission = selectedMissionId
    ? await prisma.mission.findUnique({
        where: { id: selectedMissionId },
        include: {
          client: true,
          employees: {
            include: {
              employee: {
                include: {
                  attendance: {
                    where: { missionId: selectedMissionId },
                    orderBy: { arrivedAt: "desc" },
                  },
                },
              },
            },
          },
        },
      })
    : null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header & Filtres */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-semibold text-zinc-700">Date de mission</label>
          <form>
            <input
              type="date"
              name="date"
              defaultValue={selectedDateStr}
              className="w-full rounded-xl border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900"
              onBlur={(e) => (window.location.href = `/attendance?date=${e.target.value}`)}
            />
          </form>
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-sm font-semibold text-zinc-700">Sélectionner la mission</label>
          <select
            className="w-full rounded-xl border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900"
            defaultValue={selectedMissionId || ""}
            onChange={(e) => (window.location.href = `/attendance?date=${selectedDateStr}&missionId=${e.target.value}`)}
          >
            <option value="">Choisir une mission...</option>
            {dayMissions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.client.name} - {format(m.plannedStartAt, "HH:mm")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste du personnel et pointage */}
      {activeMission ? (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
            <h2 className="font-bold text-zinc-900">
              Personnel affecté - {activeMission.client.name}
            </h2>
            <span className="text-xs font-medium px-2.5 py-1 bg-zinc-200 text-zinc-700 rounded-full">
              {activeMission.employees.length} agents prévus
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-zinc-500 font-medium border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-4">Agent</th>
                  <th className="px-6 py-4">Pointages effectués</th>
                  <th className="px-6 py-4 text-right">Nouveau pointage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {activeMission.employees.map(({ employee }) => (
                  <tr key={employee.id} className="hover:bg-zinc-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-zinc-900">{employee.lastName.toUpperCase()} {employee.firstName}</p>
                      <p className="text-xs text-zinc-500">{employee.phone || "Pas de contact"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {employee.attendance.length > 0 ? (
                          employee.attendance.map((log) => (
                            <span key={log.id} className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-medium">
                              {format(log.arrivedAt, "HH:mm")}
                            </span>
                          ))
                        ) : (
                          <span className="text-zinc-400 italic text-xs">Aucun pointage</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <AttendanceForm
                        missionId={activeMission.id}
                        employeeId={employee.id}
                        missionDate={selectedDateStr}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
          <div className="size-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
            <svg className="size-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-zinc-500 font-medium">Sélectionnez une mission pour commencer le pointage</p>
        </div>
      )}
    </div>
  );
}
