"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { logoutAction } from "@/actions/auth";
import { LoginFormData } from "@/schemas/auth";
import { currentUserKey } from "@/hooks/useCurrentUser";
import api from "@/lib/axios";

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
      console.log("Login response:", result);

      queryClient.setQueryData(currentUserKey, result.user);
      document.cookie = `user-role=${result.user.role}; path=/; max-age=${60 * 60 * 24 * 7}`;
      router.push(next ?? `/${result.user.portal}`);
      return true;
    } catch (err: any) {
      const message =
        err.response?.result?.non_field_errors?.[0] ??
        err.response?.result?.detail ??
        "Invalid email or password";
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    queryClient.removeQueries({ queryKey: currentUserKey });
    await logoutAction();
  }

  return { login, logout, isLoading, error };
}
