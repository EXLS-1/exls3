import { create } from "zustand";

interface NetworkState {
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isOnline: typeof window !== "undefined" ? window.navigator.onLine : true,
  setIsOnline: (status) => set({ isOnline: status }),
}));