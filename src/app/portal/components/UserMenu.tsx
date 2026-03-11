"use client";

import { useEffect, useState } from "react";
import UserMenuModal from "./UserMenuModal";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@/hooks/useAuth";


export default function UserMenu() {
  const { data: currentUser, isLoading, isError, refetch } = useCurrentUser();
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const fullName = currentUser?.full_name || "User";
  const initials = fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (isError) {
      logout();
    }
  }, [isError, logout]);

  if (isError) {
    return (
      <div className="flex items-center text-xs md:text-sm text-secondary-text">
        Unable to verify user details. Redirecting to login...
      </div>
    );
  }

  const displayName = isLoading ? "Loading..." : fullName;
  const displayRole = currentUser?.role || "user";
  const displayInitials = isLoading ? "..." : initials;

  return (
    <div className="relative flex items-center space-x-2">
      <div
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="cursor-pointer rounded-lg p-1 md:px-2 md:py-1 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-secondary text-tetiary text-xs font-semibold flex items-center justify-center">
            {displayInitials}
          </div>
          <div className="hidden md:block">
            <p className="text-sm md:text-base font-medium text-tetiary leading-none">
              {displayName}
            </p>
            <p className="text-xs md:text-sm text-secondary-text capitalize">
              {displayRole}
            </p>
          </div>
        </div>
      </div>
      <UserMenuModal
        currentUser={currentUser ?? null}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        isError={isError}
        onRetry={() => refetch()}
      />
    </div>
  );
}
