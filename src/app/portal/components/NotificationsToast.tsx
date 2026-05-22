"use client";

import { useEffect } from "react";;
import { useRouter } from "next/navigation";
import { FaBell, FaTimes } from "react-icons/fa";
import { useNotificationContext } from "@/src/context/NotificationContext";

export default function NotificationToast() {
  const { toasts, dismissToast } = useNotificationContext();
  const router = useRouter();

  const handleClick = (toastId: string, link: string) => {
    dismissToast(toastId);
    if (link) router.push(link);
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.toastId}
          className="bg-primary-dark border border-tetiary/20 rounded-xl shadow-2xl p-4 flex items-start gap-3 animate-slide-in"
        >
          {/* Icon */}
          <div className="shrink-0 w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mt-0.5">
            <FaBell className="w-4 h-4 text-secondary" />
          </div>

          {/* Content */}
          <button
            className="flex-1 text-left min-w-0"
            onClick={() => handleClick(toast.toastId, toast.link)}
          >
            <p className="text-tetiary text-sm font-medium truncate">
              {toast.title}
            </p>
            <p className="text-tetiary/60 text-xs mt-0.5 line-clamp-2">
              {toast.message}
            </p>
          </button>

          {/* Dismiss */}
          <button
            onClick={() => dismissToast(toast.toastId)}
            className="flex-shrink-0 text-tetiary/40 hover:text-tetiary transition-colors"
          >
            <FaTimes className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}