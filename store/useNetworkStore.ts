// store/useNetworkStore.ts
// This store manages the network status of the application, specifically whether the user is online or offline.
// It provides a function to update the online status, which can be used in response to network changes.
// The store is created using the Zustand library, which allows for easy state management in React applications.
// The state includes:
// - isOnline: A boolean indicating whether the user is currently online (true) or offline (false).
// - setIsOnline: A function to update the isOnline status.

import { create } from "zustand";

interface NetworkState {
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isOnline: typeof window !== "undefined" ? window.navigator.onLine : true,
  setIsOnline: (status) => set({ isOnline: status }),
}));