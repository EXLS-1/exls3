import { create } from "zustand";

interface UserState {
  role: string | null;
  userId: string | null;
  name: string | null;
  setUserInfo: (info: { role: string | null; userId: string | null; name: string | null }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  role: null,
  userId: null,
  name: null,
  setUserInfo: (info) => set({ 
    role: info.role, 
    userId: info.userId, 
    name: info.name 
  }),
  clearUser: () => set({ 
    role: null, 
    userId: null, 
    name: null 
  }),
}));