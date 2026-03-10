"use client";

import { useState } from "react";
import UserMenuModal from "./UserMenuModal";
import { useCurrentUser } from "@/hooks/useCurrentUser";


export default function UserMenu() {
  const { data: currentUser, isLoading } = useCurrentUser();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const fullName = currentUser?.full_name || "User";
  const initials = fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative flex items-center space-x-2">
      <div
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="cursor-pointer rounded-lg p-1 md:px-2 md:py-1 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-secondary text-tetiary text-xs font-semibold flex items-center justify-center">
            {isLoading ? "..." : initials}
          </div>
          <div className="hidden md:block">
            <p className="text-sm md:text-base font-medium text-tetiary leading-none">
              {isLoading ? "Loading..." : fullName}
            </p>
            <p className="text-xs md:text-sm text-secondary-text capitalize">
              {currentUser?.role || "user"}
            </p>
          </div>
        </div>
      </div>
      <UserMenuModal
        currentUser={currentUser ?? null}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
      />
    </div>
  );
}
