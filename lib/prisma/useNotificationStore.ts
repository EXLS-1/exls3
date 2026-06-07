import { create } from "zustand";

export type NotificationType = "success" | "error" | "info";

interface NotificationState {
  message: string | null;
  type: NotificationType;
  isVisible: boolean;
  showNotification: (message: string, type?: NotificationType) => void;
  hideNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  message: null,
  type: "info",
  isVisible: false,
  showNotification: (message, type = "info") => {
    set({ message, type, isVisible: true });
    
    // Auto-dismiss après 5 secondes pour une UX professionnelle
    setTimeout(() => {
      set({ isVisible: false });
    }, 5000);
  },
  hideNotification: () => set({ isVisible: false }),
}));