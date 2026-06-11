"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function VerifyEmailPage() {
  const { key } = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
  console.log("key from params:", key)
  console.log("posting to:", "/auth/registration/verify-email/")
    async function verify() {
      try {
        const decodedKey = decodeURIComponent(key as string)  // ← decode first
      console.log("decoded key:", decodedKey)
      const response = await api.post("/auth/registration/verify-email/", { 
        key: decodedKey  // ← send decoded key
      });
        setStatus("success");
        setTimeout(() => router.push("/portal/sign-in?verified=true"), 3000);
      } catch {
        setStatus("error");
      }
    }
    verify();
  }, [key]);

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-tetiary">
      <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center"
        style={{ boxShadow: "0 6px 18px rgba(26, 36, 33, 0.06)" }}
      >
        {status === "loading" && (
          <>
            <div className="w-12 h-12 border-4 border-primary border-t-transparent 
              rounded-full animate-spin mx-auto mb-4" />
            <p className="text-primary font-semibold">Verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center 
              justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">Email Verified!</h2>
            <p className="text-sm text-muted">Redirecting you to sign in...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center 
              justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">Verification Failed</h2>
            <p className="text-sm text-muted mb-4">
              The link may have expired. Request a new one.
            </p>
            <button
              onClick={() => router.push("/portal/sign-in")}
              className="w-full py-3 bg-secondary text-white rounded-lg font-semibold"
            >
              Back to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
}