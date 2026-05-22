"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useNotifications, Notification } from "@/hooks/useNotifications";

interface ToastNotification extends Notification {
  toastId: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  toasts: ToastNotification[];
  dismissToast: (toastId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
console.log("NotificationProvider rendered");
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const dismissToast = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
  }, []);

  const handleNewNotification = useCallback((n: Notification) => {
    const toastId = `${n.id}-${Date.now()}`;
    setToasts((prev) => [...prev, { ...n, toastId }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
    }, 5000);
  }, []);

  const base = useNotifications(handleNewNotification);

  return (
    <NotificationContext.Provider value={{ ...base, toasts, dismissToast }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotificationContext must be used inside NotificationProvider"
    );
  }
  return ctx;
}