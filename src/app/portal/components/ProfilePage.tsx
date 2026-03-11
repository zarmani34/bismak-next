"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { FaIdBadge, FaShieldAlt } from "react-icons/fa";
import {
  FaArrowRightFromBracket,
  FaChartSimple,
  FaPenToSquare,
} from "react-icons/fa6";
import ProfilePageInformation from "./profilePageInformation";
import ErrorState from "./states/ErrorState";

const formatDate = (value?: string) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatDateTime = (value?: string) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const toTitleCase = (value?: string) => {
  if (!value) return "User";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export default function ProfilePage() {
  const {
    data: currentUser,
    isLoading,
    isError,
    refetch,
  } = useCurrentUser();
  const { logout } = useAuth();

  if (isError) {
    return (
      <ErrorState
        message="Unable to load profile data."
        onRetry={() => refetch()}
        className="m-4"
      />
    );
  }

  const fullName = currentUser?.full_name || "Loading user...";
  const roleLabel = toTitleCase(currentUser?.role);
  const initials = fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const quickStats = [
    {
      label: "Account ID",
      value: currentUser?.pk ? `#${currentUser.pk}` : "Loading...",
      icon: <FaChartSimple className="w-4 h-4" />,
    },
    {
      label: "Role",
      value: currentUser?.role ? currentUser.role.toUpperCase() : "--",
      icon: <FaIdBadge className="w-4 h-4" />,
    },
    {
      label: "Account Status",
      value: currentUser?.is_verified ? "Verified" : "Unverified",
      icon: <FaShieldAlt className="w-4 h-4" />,
    },
  ];

  const activityFeed = [
    {
      title: "Account created",
      time: formatDate(currentUser?.date_joined),
    },
    {
      title: "Last login",
      time: formatDateTime(currentUser?.last_login),
    },
    {
      title: "Verification",
      time: currentUser?.is_verified ? "Verified account" : "Pending verification",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-linear-to-r from-primary/15 via-primary-light/30 to-secondary/10 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-semibold shadow-md">
              {isLoading ? "..." : initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-dark">{fullName}</h1>
              <p className="text-secondary-text">{roleLabel} Account</p>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                <FaShieldAlt className="w-3 h-3" />
                {currentUser?.is_verified ? "Verified Access" : "Pending Verification"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-primary-dark text-sm hover:bg-primary-light/20 transition-colors">
              <FaPenToSquare className="w-4 h-4" />
              Edit Profile
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm hover:bg-primary-dark transition-colors"
            >
              <FaArrowRightFromBracket className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-primary-light/20 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-secondary-text">{stat.label}</p>
              <span className="text-primary">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-primary-dark mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <ProfilePageInformation currentUser={currentUser} />

        <div className="space-y-6">
          <div className="rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-primary-dark">Recent Account Activity</h2>
            </div>
            <div className="p-4 bg-primary-light/10 space-y-3">
              {activityFeed.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-primary-light/30 p-3 bg-white/70"
                >
                  <p className="text-sm text-primary-dark font-medium">{item.title}</p>
                  <p className="text-xs text-secondary-text mt-1">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
