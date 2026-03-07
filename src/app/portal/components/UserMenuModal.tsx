import { useAuth } from "@/hooks/useAuth";
import { User } from "@/schemas/user";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { FaArrowRightFromBracket, FaCircleCheck, FaHeadset, FaIdBadge, FaUserGear } from "react-icons/fa6";

type Props = {
  currentUser: User | null;
  showUserMenu: boolean;
  setShowUserMenu: Dispatch<SetStateAction<boolean>>;
};

export default function UserMenuModal({
  currentUser,
  showUserMenu,
  setShowUserMenu,
}: Props) {
  const { logout } = useAuth();

  if (!showUserMenu) return null;

  const fullName = currentUser?.full_name || "User";
  const initials = fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const profilePath = currentUser
    ? `/portal/${currentUser.role}/profile`
    : "/portal/login";

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-primary-dark/20 backdrop-blur-[1px] z-20 transition-opacity duration-300"
        onClick={() => setShowUserMenu(false)}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-[calc(100%+12px)] w-72 bg-tetiary rounded-xl shadow-xl border border-primary/20 overflow-hidden z-30"
      >
        <div className="px-4 py-4 border-b border-primary-light/20 bg-primary-light/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white text-sm font-semibold flex items-center justify-center">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-primary-dark">{fullName}</p>
              <p className="text-xs text-secondary-text">{currentUser?.user_id}</p>
              <div className="mt-1 inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-primary/15 text-primary uppercase">
                <FaIdBadge className="w-3 h-3" />
                {currentUser?.role || "user"}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-primary-light/20 text-xs text-secondary-text space-y-1">
          <p>Email: {currentUser?.email || "Not assigned"}</p>
          <p>Phone: {currentUser?.phone_number || "Not available"}</p>
          <p className="inline-flex items-center gap-1 text-primary">
            <FaCircleCheck className="w-3 h-3" />
            {currentUser?.is_verified ? "Verified account" : "Unverified account"}
          </p>
        </div>

        <div className="py-2 text-primary-dark">
          <Link
            href={profilePath}
            onClick={() => setShowUserMenu(false)}
            className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary-light/20 flex items-center gap-2"
          >
            <FaUserGear className="w-4 h-4" />
            Profile Settings
          </Link>
          <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary-light/20 flex items-center gap-2">
            <FaHeadset className="w-4 h-4" />
            Support
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary-light/20 text-secondary flex items-center gap-2"
          >
            <FaArrowRightFromBracket className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
