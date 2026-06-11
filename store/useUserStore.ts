// store/useUserStore.ts
// This store manages the user information and permissions in the application.
// It includes the user's role, ID, name, and a list of permissions based on their role.
// The store provides functions to set user information, clear user data, and check for specific permissions.
// The store is created using the Zustand library, which allows for easy state management in React applications.

import { create } from "zustand";

export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: ["can_edit_attendance", "can_view_reports", "can_manage_users"],
  MANAGER: ["can_edit_attendance", "can_view_reports"],
  EMPLOYEE: ["can_view_own_attendance"],
};

interface UserState {
  role: UserRole | null;
  userId: string | null;
  name: string | null;
  permissions: string[];
  setUserInfo: (info: { role: UserRole | null; userId: string | null; name: string | null }) => void;
  clearUser: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useUserStore = create<UserState>((set) => ({
  role: null,
  userId: null,
  name: null,
  permissions: [],
  setUserInfo: (info) => set({ 
    role: info.role,
    userId: info.userId, 
    name: info.name,
    permissions: info.role ? ROLE_PERMISSIONS[info.role] || [] : []
  }),
  clearUser: () => set({ 
    role: null, 
    userId: null, 
    name: null,
    permissions: []
  }),
  hasPermission: (permission) => get().permissions.includes(permission),
}));