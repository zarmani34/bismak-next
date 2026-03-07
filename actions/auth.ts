"use server";

import { redirect } from "next/navigation";
import { LoginFormData } from "@/schemas/auth";
import { cookies } from "next/headers";

const DJANGO_API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";


export async function loginAction(credentials: LoginFormData) {
  const response = await fetch(`${DJANGO_API}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    return {
      success: false as const,
      message: error.non_field_errors?.[0] ?? "Invalid email or password",
    };
  }

  const data = await response.json();
  return {
    success: true as const,
    user: data.user,
  };
}

/**
 * LOGOUT SERVER ACTION
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  
  // manually delete both cookies from the browser
  cookieStore.delete("access-token");
  cookieStore.delete("refresh-token");

  await fetch(`${DJANGO_API}/auth/logout/`, {
    method: "POST",
    credentials: "include",
  });

  redirect("/portal/sign-in");
}