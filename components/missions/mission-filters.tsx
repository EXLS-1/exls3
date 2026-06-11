// components/missions/mission-filters.tsx
// This component provides filters for missions based on employees and sites.
// It fetches the necessary data for the filters and allows users to reset them easily.
// The component uses a custom store to manage the selected filters and updates the UI accordingly.
// It also handles loading states while fetching data for the filters.

"use client";

import React, { useEffect, useState } from "react";
import { useMissionFilterStore } from "@/store/useMissionFilterStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { getEmployeesForFilter, getSitesForFilter } from "@/data/data-fetch";
import { Skeleton } from "@/components/ui/skeleton";

interface EmployeeOption {
  id: string;
  firstName: string;
  lastName: string;
}

interface SiteOption {
  id: string;
  name: string;
}

export function MissionFilters() {
  const { selectedEmployeeId, selectedSiteId, setEmployeeFilter, setSiteFilter, resetFilters } =
    useMissionFilterStore();

  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [sites, setSites] = useState<SiteOption[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingSites, setLoadingSites] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoadingEmployees(true);
      const fetchedEmployees = await getEmployeesForFilter();
      setEmployees(fetchedEmployees);
      setLoadingEmployees(false);

      setLoadingSites(true);
      const fetchedSites = await getSitesForFilter();
      setSites(fetchedSites);
      setLoadingSites(false);
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-white rounded-xl shadow-sm border border-zinc-200">
      <div className="flex-1 min-w-45">
        <Label htmlFor="employee-filter" className="text-sm font-medium text-zinc-700">
          Filtrer par Agent
        </Label>
        {loadingEmployees ? (
          <Skeleton className="h-10 w-full mt-2" />
        ) : (
          <Select
            value={selectedEmployeeId || ""}
            onValueChange={(value) => setEmployeeFilter(value || null)}
          >
            <SelectTrigger id="employee-filter" className="w-full h-10 mt-2">
              <SelectValue placeholder="Tous les agents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les agents</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.lastName} {employee.firstName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex-1 min-w-45">
        <Label htmlFor="site-filter" className="text-sm font-medium text-zinc-700">
          Filtrer par Site
        </Label>
        {loadingSites ? (
          <Skeleton className="h-10 w-full mt-2" />
        ) : (
          <Select value={selectedSiteId || ""} onValueChange={(value) => setSiteFilter(value || null)}>
            <SelectTrigger id="site-filter" className="w-full h-10 mt-2">
              <SelectValue placeholder="Tous les sites" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les sites</SelectItem>
              {sites.map((site) => (
                <SelectItem key={site.id} value={site.id}>
                  {site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {(selectedEmployeeId || selectedSiteId) && (
        <Button variant="outline" onClick={resetFilters} className="h-10 px-4 py-2 mt-2">
          <XCircle className="mr-2 h-4 w-4" /> Réinitialiser
        </Button>
      )}
    </div>
  );
}