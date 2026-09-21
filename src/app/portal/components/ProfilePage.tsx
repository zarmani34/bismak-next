"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { currentUserKey } from "@/hooks/useCurrentUser";
import api from "@/lib/axios";
import { extractApiError } from "@/lib/errors";
import { User } from "@/schemas/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaIdBadge, FaShieldAlt } from "react-icons/fa";
import {
  FaArrowRightFromBracket,
  FaChartSimple,
  FaFloppyDisk,
  FaPenToSquare,
  FaXmark,
} from "react-icons/fa6";
import ProfilePageInformation from "./profilePageInformation";
import ErrorState from "./states/ErrorState";
import ProfilePageSkeleton from "./skeletons/ProfilePageSkeleton";
import { formatDate, formatDateTime } from "@/src/utils/date";

const toTitleCase = (value?: string) => {
  if (!value) return "User";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

type ProfileEditValues = {
  first_name: string;
  last_name: string;
  phone_number: string;
};

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const {
    data: currentUser,
    isLoading,
    isError,
    refetch,
  } = useCurrentUser();
  const { logout } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileEditValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
    },
  });

  useEffect(() => {
    if (!currentUser) return;

    reset({
      first_name: currentUser.first_name ?? "",
      last_name: currentUser.last_name ?? "",
      phone_number: currentUser.phone_number ?? "",
    });
  }, [currentUser, reset]);

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileEditValues) => {
      const { data: updated } = await api.patch("/auth/user/", data);
      return updated as User;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(currentUserKey, updatedUser);
      setIsEditing(false);
    },
  });

  const handleEditToggle = () => {
    if (isEditing && currentUser) {
      reset({
        first_name: currentUser.first_name ?? "",
        last_name: currentUser.last_name ?? "",
        phone_number: currentUser.phone_number ?? "",
      });
    }
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (data: ProfileEditValues) => {
    await updateProfile.mutateAsync(data);
  };

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

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
      value: currentUser?.user_id ? `${currentUser.user_id}` : "Loading...",
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
      time: formatDate(currentUser?.date_joined, { fallback: "Not available" }),
    },
    {
      title: "Last login",
      time: formatDateTime(currentUser?.last_login, { fallback: "Not available" }),
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
            <button
              type="button"
              onClick={handleEditToggle}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-primary-dark text-sm hover:bg-primary-light/20 transition-colors"
            >
              <FaPenToSquare className="w-4 h-4" />
              {isEditing ? "Close Editor" : "Edit Profile"}
            </button>
            <button
              type="button"
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

      {isEditing ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-xl border border-border shadow-sm overflow-hidden bg-primary-light/10"
        >
          <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-primary-dark">Edit Profile</h2>
              <p className="text-xs text-secondary-text">
                Update your name and phone number only.
              </p>
            </div>
            <button
              type="button"
              onClick={handleEditToggle}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-medium text-primary-dark hover:bg-primary-light/20"
            >
              <FaXmark className="h-3 w-3" />
              Cancel
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-secondary-text">First name</label>
              <input
                {...register("first_name", { required: "First name is required" })}
                className="mt-1 w-full rounded-xl border border-border bg-tetiary/90 px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="First name"
              />
              {errors.first_name ? (
                <p className="mt-1 text-xs text-secondary-light">{errors.first_name.message}</p>
              ) : null}
            </div>

            <div>
              <label className="text-xs text-secondary-text">Last name</label>
              <input
                {...register("last_name", { required: "Last name is required" })}
                className="mt-1 w-full rounded-xl border border-border bg-tetiary/90 px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Last name"
              />
              {errors.last_name ? (
                <p className="mt-1 text-xs text-secondary-light">{errors.last_name.message}</p>
              ) : null}
            </div>

            <div>
              <label className="text-xs text-secondary-text">Phone number</label>
              <input
                {...register("phone_number", { required: "Phone number is required" })}
                className="mt-1 w-full rounded-xl border border-border bg-tetiary/90 px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Phone number"
              />
              {errors.phone_number ? (
                <p className="mt-1 text-xs text-secondary-light">
                  {errors.phone_number.message}
                </p>
              ) : null}
            </div>
          </div>

          {updateProfile.error ? (
            <div className="px-6 pb-2 text-xs text-secondary-light">
              {extractApiError(updateProfile.error)}
            </div>
          ) : null}

          <div className="px-6 pb-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleEditToggle}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-primary-dark hover:bg-primary-light/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || updateProfile.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-secondary-dark disabled:opacity-60"
            >
              <FaFloppyDisk className="h-4 w-4" />
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : null}

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
