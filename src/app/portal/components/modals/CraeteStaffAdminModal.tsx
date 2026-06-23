"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractApiError } from "@/lib/errors";
import { useState } from "react";
import { useCreateStaffAdmin } from "@/hooks/useUsers";
import { CreateStaffAdminData, CreateStaffAdminSchema } from "@/schemas/users";

/**
 * CREATE STAFF/ADMIN MODAL
 *
 * One form, role selector decides which Django endpoint gets called
 * (handled inside useCreateStaffAdmin). Only rendered when isOpen is true.
 */
export default function CreateStaffAdminModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const { mutate, isPending } = useCreateStaffAdmin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStaffAdminData>({
    resolver: zodResolver(CreateStaffAdminSchema),
    defaultValues: { role: "staff" },
  });

  if (!isOpen) return null;

  const onSubmit = (data: CreateStaffAdminData) => {
    setServerError(null);
    mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
      onError: (err) => setServerError(extractApiError(err)),
    });
  };

  const handleClose = () => {
    reset();
    setServerError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        className="bg-tetiary rounded-xl w-full max-w-md p-6"
        style={{ boxShadow: "0 6px 18px rgba(26, 36, 33, 0.08)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-primary">
            Create Staff / Admin Account
          </h2>
          <button
            onClick={handleClose}
            className="text-[#8a8a8a] hover:text-[#333333] transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-error">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Role selector */}
          <div>
            <label className="block text-xs font-semibold text-body-text mb-1.5 uppercase tracking-wide">
              Role
            </label>
            <select
              {...register("role")}
              className="w-full px-4 py-2.5 rounded-lg text-sm bg-tetiary border border-primary/30
                text-[#333333] focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-xs text-error">{errors.role.message}</p>
            )}
          </div>

          {/* First / Last name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-body-text mb-1.5 uppercase tracking-wide">
                First Name
              </label>
              <input
                {...register("first_name")}
                placeholder="John"
                className={`w-full px-4 py-2.5 rounded-lg text-sm bg-tetiary border text-[#333333]
                  focus:outline-none focus:ring-2 focus:ring-primary
                  ${errors.first_name ? "border-primary/30" : "border-primary/30"}`}
              />
              {errors.first_name && (
                <p className="mt-1 text-xs text-error">{errors.first_name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-body-text mb-1.5 uppercase tracking-wide">
                Last Name
              </label>
              <input
                {...register("last_name")}
                placeholder="Doe"
                className={`w-full px-4 py-2.5 rounded-lg text-sm bg-tetiary border text-[#333333]
                  focus:outline-none focus:ring-2 focus:ring-primary
                  ${errors.last_name ? "border-primary/30" : "border-primary/30"}`}
              />
              {errors.last_name && (
                <p className="mt-1 text-xs text-error">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-body-text mb-1.5 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="john.doe@example.com"
              className={`w-full px-4 py-2.5 rounded-lg text-sm bg-tetiary border text-[#333333]
                focus:outline-none focus:ring-2 focus:ring-primary
                ${errors.email ? "border-primary/30" : "border-primary/30"}`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-error">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-body-text mb-1.5 uppercase tracking-wide">
              Phone Number
            </label>
            <input
              {...register("phone_number")}
              placeholder="123-456-7890"
              className={`w-full px-4 py-2.5 rounded-lg text-sm bg-tetiary border text-[#333333]
                focus:outline-none focus:ring-2 focus:ring-primary
                ${errors.phone_number ? "border-primary/30" : "border-primary/30"}`}
            />
            {errors.phone_number && (
              <p className="mt-1 text-xs text-error">{errors.phone_number.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-body-text mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                {...register("password1")}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 rounded-lg text-sm bg-tetiary border text-[#333333]
                  focus:outline-none focus:ring-2 focus:ring-primary
                  ${errors.password1 ? "border-primary/30" : "border-primary/30"}`}
              />
              {errors.password1 && (
                <p className="mt-1 text-xs text-error">{errors.password1.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-body-text mb-1.5 uppercase tracking-wide">
                Confirm
              </label>
              <input
                type="password"
                {...register("password2")}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 rounded-lg text-sm bg-tetiary border text-[#333333]
                  focus:outline-none focus:ring-2 focus:ring-primary
                  ${errors.password2 ? "border-primary/30" : "border-primary/30"}`}
              />
              {errors.password2 && (
                <p className="mt-1 text-xs text-error">{errors.password2.message}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold text-primary
                border border-primary hover:bg-primary/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold text-white
                bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed
                transition-colors"
            >
              {isPending ? "Creating…" : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}