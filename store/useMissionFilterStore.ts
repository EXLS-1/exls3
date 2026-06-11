// store/useMissionFilterStore.ts
// This store manages the state of mission filters, including selected employee and site IDs.
// It provides functions to set the employee and site filters, as well as a function to reset all filters.
// The store is created using the Zustand library, which allows for easy state management in React applications.
// The state includes:
// - selectedEmployeeId: The ID of the currently selected employee filter (or null if no filter is applied).
// - selectedSiteId: The ID of the currently selected site filter (or null if no filter is applied).
// - setEmployeeFilter: A function to update the selected employee filter.
// - setSiteFilter: A function to update the selected site filter.
// - resetFilters: A function to reset both filters to their default state (null).

import { create } from "zustand";

interface MissionFilterState {
  selectedEmployeeId: string | null;
  selectedSiteId: string | null;
  setEmployeeFilter: (employeeId: string | null) => void;
  setSiteFilter: (siteId: string | null) => void;
  resetFilters: () => void;
}

export const useMissionFilterStore = create<MissionFilterState>((set) => ({
  selectedEmployeeId: null,
  selectedSiteId: null,
  setEmployeeFilter: (employeeId) => set({ selectedEmployeeId: employeeId }),
  setSiteFilter: (siteId) => set({ selectedSiteId: siteId }),
  resetFilters: () =>
    set({
      selectedEmployeeId: null,
      selectedSiteId: null,
    }),
}));