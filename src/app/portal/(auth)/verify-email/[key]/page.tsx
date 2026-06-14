"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function VerifyEmailPage() {
  const { key } = useParams<{ key?: string | string[] }>();
  const router = useRouter();
  const hasKey = Boolean(key);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    hasKey ? "loading" : "error"
  );
  const [message, setMessage] = useState(
    hasKey
      ? "We are verifying your email link. This usually takes a few seconds."
      : "Verification link is missing. Please request a new one."
  );

  useEffect(() => {
    const rawKey = Array.isArray(key) ? key[0] : key;

    if (typeof rawKey !== "string" || !rawKey) {
      return;
    }

    const decodedKey = decodeURIComponent(rawKey);

    let timer: ReturnType<typeof setTimeout> | undefined;

    async function verify() {
      try {
        await api.post("/auth/registration/verify-email/", {
          key: decodedKey,
        });

        setStatus("success");
        setMessage("Email verified successfully. Redirecting you to sign in...");
        timer = setTimeout(() => router.push("/portal/sign-in?verified=true"), 2500);
      } catch {
        setStatus("error");
        setMessage("The verification link may be invalid or expired. Request a new one.");
      }
    }

    verify();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [key, router]);

  return (
    <div className="min-h-screen bg-tetiary px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <div
          className="w-full rounded-3xl border border-border bg-light-gray/90 px-5 py-8 text-center shadow-sm sm:px-8 sm:py-10"
          style={{ boxShadow: "0 10px 30px rgba(26, 36, 33, 0.08)" }}
        >
          {status === "loading" && (
            <>
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <h2 className="text-xl font-bold text-primary-dark sm:text-2xl">
                Verifying your email
              </h2>
              <p className="mt-3 text-sm leading-6 text-secondary-text sm:text-base">
                {message}
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <svg
                  className="h-8 w-8 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-primary-dark sm:text-2xl">
                Email verified
              </h2>
              <p className="mt-3 text-sm leading-6 text-secondary-text sm:text-base">
                {message}
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
                <svg
                  className="h-8 w-8 text-error"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-primary-dark sm:text-2xl">
                Verification failed
              </h2>
              <p className="mt-3 text-sm leading-6 text-secondary-text sm:text-base">
                {message}
              </p>
              <button
                onClick={() => router.push("/portal/sign-in")}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-secondary px-4 py-3 font-semibold text-white transition-colors hover:bg-secondary-dark sm:w-auto sm:min-w-40"
              >
                Back to Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
