"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { logoutAction } from "@/actions/auth";
import { LoginFormData, SignUpFormData } from "@/schemas/auth";
import { currentUserKey } from "@/hooks/useCurrentUser";
import api from "@/lib/axios";
import { extractApiError } from "@/lib/errors";
import { isAxiosError } from "axios";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(credentials: LoginFormData, next: string | null = null) {
    setIsLoading(true);
    setError(null);

    try {
      const { data: result } = await api.post("/auth/login/", credentials);

      queryClient.setQueryData(currentUserKey, result.user);
      const isProduction = process.env.NODE_ENV === "production";
      document.cookie = `user-role=${result.user.role}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax${isProduction ? "; secure" : ""}`;
      window.location.href = next ?? `/${result.user.portal}`;
      return true;
    } catch (err: unknown) {
      setError(extractApiError(err));
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function signUp(credentials: SignUpFormData) {
    setIsLoading(true);
    setError(null);

    try {
      await api.post("/auth/registration/client/", credentials);
      return { success: true };
    } catch (err: any) {
      if (isAxiosError(err) && err.response?.status === 500) {
        setError("Something went wrong on our end. Please try again.");
        return { success: false };
      }
      setError(extractApiError(err));
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    queryClient.removeQueries({ queryKey: currentUserKey });
    await logoutAction();
  }

  return { login, signUp, logout, isLoading, error };
}
