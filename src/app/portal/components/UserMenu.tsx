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
    <div className="relative flex items-center space-x-3">
      <div
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="md:block cursor-pointer rounded-lg px-2 py-1 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary text-tetiary text-xs font-semibold flex items-center justify-center">
            {isLoading ? "..." : initials}
          </div>
          <div>
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
