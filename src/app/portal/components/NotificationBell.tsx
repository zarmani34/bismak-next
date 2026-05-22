"use client";

import { useState, useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useNotificationContext } from "@/src/context/NotificationContext";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { notifications, unreadCount, markAsRead, markAllRead } =
    useNotificationContext();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (id: string, link: string) => {
    await markAsRead(id);
    setIsOpen(false);
    if (link) router.push(link);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 text-tetiary hover:bg-secondary-dark rounded-lg relative transition-colors duration-200"
      >
        <FaBell className="w-5 h-5 md:w-6 md:h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-primary-dark border border-tetiary/20 rounded-xl shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-tetiary/20">
            <h3 className="text-tetiary font-semibold text-sm">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-secondary-light hover:text-secondary transition-colors duration-200"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-tetiary/10">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-tetiary/50 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n.id, n.link)}
                  className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors duration-200 flex items-start gap-3 ${
                    !n.is_read ? "bg-secondary/5" : ""
                  }`}
                >
                  {/* Unread dot */}
                  <div className="mt-1.5 shrink-0">
                    {!n.is_read ? (
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-transparent" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-tetiary text-sm font-medium truncate">
                      {n.title}
                    </p>
                    <p className="text-tetiary/60 text-xs mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-tetiary/40 text-xs mt-1">
                      {formatDistanceToNow(new Date(n.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 10 && (
            <div className="px-4 py-3 border-t border-tetiary/20">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/portal/notifications");
                }}
                className="text-xs text-secondary-light hover:text-secondary transition-colors w-full text-center"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}