import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string;
  is_read: boolean;
  actor_name: string | null;
  created_at: string;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export function useNotifications(
  onNewNotification?: (n: Notification) => void
): UseNotificationsReturn {
    console.log("useNotifications hook called");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // ── Fetch initial notifications + unread count on mount ──────────────────
  const fetchInitial = useCallback(async () => {
  try {
    const [notifRes, countRes] = await Promise.all([
      api.get("/notifications/"),
      api.get("/notifications/unread-count/"),
    ]);
    setNotifications(notifRes.data.results ?? notifRes.data);
    setUnreadCount(countRes.data.unread_count);
  } catch (err: any) {
    // Silently ignore auth errors — user may not be logged in yet
    if (err.response?.status !== 401) {
      console.error("Failed to fetch notifications:", err);
    }
  }
}, []);;

  // ── SSE connection ────────────────────────────────────────────────────────
  useEffect(() => {
  fetchInitial();

  let eventSource: EventSource | null = null;

  api.get('/auth/user/').then((res) => {
    const userCode = res.data.user_id;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");
    const streamUrl = `${baseUrl}/api/notifications/stream/?channel=notifications-${userCode}`;
    console.log("SSE URL:", streamUrl);

    eventSource = new EventSource(streamUrl, { withCredentials: true });

    eventSource.addEventListener("notification", (e: MessageEvent) => {
      const notification: Notification = JSON.parse(e.data);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      onNewNotification?.(notification);
    });

    eventSource.onopen = () => {
      console.log("SSE connected");
      setIsConnected(true);
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };
  }).catch((err) => {
    console.error("Failed to get user for SSE:", err);
  });

  return () => {
    eventSource?.close();
    setIsConnected(false);
  };
}, [fetchInitial]);

  // ── Mark single notification as read ─────────────────────────────────────
  const markAsRead = useCallback(async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read/`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  }, []);

  // ── Mark all as read ──────────────────────────────────────────────────────
  const markAllRead = useCallback(async () => {
    try {
      await api.post("/notifications/mark-all-read/");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  }, []);

  return { notifications, unreadCount, isConnected, markAsRead, markAllRead };
}