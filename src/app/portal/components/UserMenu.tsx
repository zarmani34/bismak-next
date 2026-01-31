"use client"

import { useState } from "react";
import UserMenuModal from "./UserMenuModal";
import { currentUser } from "./constants";

export default function UserMenu() {
  const [showUserMenu, setShowUserMenu] = useState(false);
    {console.log(currentUser.name.split(" ").map(n => n[0]).join(""))}
    return (
        <div className="flex items-center space-x-3">
            <div className="relative">
              <div
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 bg-secondary hover:bg-secondary-dark text-tetiary rounded-full flex items-center justify-center text-sm font-medium cursor-pointer"
              >
                {currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase()}
              </div>
              {showUserMenu && (
                <UserMenuModal
                  currentUser={currentUser}
                  showUserMenu={showUserMenu}
                  setShowUserMenu={setShowUserMenu}
                />
              )}
            </div>
            <div className="hidden md:block">
              <p className="text-sm md:text-xl font-medium text-tetiary">
                Bayo Ismail
              </p>
              <p className="text-xs md:text-sm text-secondary-text">
                Project Owner
              </p>
            </div>
            
          </div>
    )
}