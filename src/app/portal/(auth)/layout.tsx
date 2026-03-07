"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const activeTab = pathname?.includes("sign-up") ? "signUp" : "signIn";
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary/20 sm:p-20">
      <div className="grid md:grid-cols-2 w-full max-w-5xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Brand Section */}
        <div className="bg-linear-to-br from-primary-dark via-primary-dark to-primary-dark text-white flex flex-col items-center justify-center relative">
          <Image
            src="/illustrations/login-bro.svg"
            alt="Portal Illustration"
            width={400}
            height={400}
            className="w-3/4 h-auto"
            priority
          />
        </div>

        {/* Form Section */}
        <div className="p-4 sm:p-10 flex flex-col justify-center bg-tetiary">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary-dark">Welcome</h2>
            <p className="text-secondary-text text-sm">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b-2 border-light-gray mb-6">
            {[
              { id: "signIn", label: "Sign In", href: "/portal/sign-in" },
              { id: "signUp", label: "Sign Up", href: "/portal/sign-up" },
            ].map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex-1 py-3 font-semibold transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "text-primary border-primary-light"
                    : "text-secondary-text border-primary-light/40"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
