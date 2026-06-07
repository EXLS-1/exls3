

"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface MissionOption {
  id: string;
  label: string;
}

interface AttendanceFiltersProps {
  initialDate: string;
  initialMissionId: string;
  missions: MissionOption[];
}

export function AttendanceFilters({
  initialDate,
  initialMissionId,
  missions,
}: AttendanceFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Si on change la date, on réinitialise souvent la mission car les missions dépendent de la date
    if (key === "date") {
      params.delete("missionId");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className={`flex flex-col md:flex-row md:items-end gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm transition-opacity ${isPending ? "opacity-70" : "opacity-100"}`}>
      <div className="flex-1 space-y-2">
        <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
          Date de mission
          {isPending && <span className="size-2 bg-zinc-400 rounded-full animate-pulse" />}
        </label>
        <input
          type="date"
          defaultValue={initialDate}
          onChange={(e) => updateFilters("date", e.target.value)}
          className="w-full rounded-xl border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900 bg-white px-3 py-2 text-sm shadow-sm transition-all"
        />
      </div>

      <div className="flex-1 space-y-2">
        <label className="text-sm font-semibold text-zinc-700">Sélectionner la mission</label>
        <select
          value={initialMissionId}
          onChange={(e) => updateFilters("missionId", e.target.value)}
          className="w-full rounded-xl border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900 bg-white px-3 py-2 text-sm shadow-sm transition-all"
        >
          <option value="">Choisir une mission...</option>
          {missions.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
