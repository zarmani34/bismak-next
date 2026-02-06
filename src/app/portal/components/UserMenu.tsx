"use client";

import { useState } from "react";
import UserMenuModal from "./UserMenuModal";
import { currentUser } from "../constants";

export default function UserMenu() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  return (
    <div className="flex items-center space-x-3">
      <div
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="md:block cursor-pointer"
      >
        <p className="text-sm md:text-xl font-medium text-tetiary">
          {currentUser.name}
        </p>
        <p className="text-xs md:text-sm text-secondary-text">
          {currentUser.role || "Project Manager"}
        </p>
        {showUserMenu && (
          <UserMenuModal
            currentUser={currentUser}
            showUserMenu={showUserMenu}
            setShowUserMenu={setShowUserMenu}
          />
        )}
      </div>
    </div>
  );
}
