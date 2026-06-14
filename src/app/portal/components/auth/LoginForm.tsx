"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { LoginFormData, LoginSchema } from "@/schemas/auth";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();
  const searchParams = useSearchParams();

  const next = searchParams.get("next");
  const verified = searchParams.get("verified");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data, next);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {verified && (
        <div className="rounded-lg border border-success/20 bg-success/10 p-3 text-sm text-success">
          Email verified successfully. You can now sign in.
        </div>
      )}

      <div>
        <label htmlFor="email" className="sr-only">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          {...register("email")}
          className={`w-full p-3 rounded-lg bg-primary-light/20 border ${
            errors.email ? "border-secondary-light" : "border-primary-dark"
          } text-primary-dark placeholder:text-primary-dark focus:outline-0 focus:bg-transparent focus:text-primary-dark font-semibold`}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-secondary-light text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password")}
            className={`w-full p-3 rounded-lg bg-primary-light/20 border ${
              errors.password ? "border-secondary-light" : "border-primary-dark"
            } text-primary-dark placeholder:text-primary-dark focus:outline-0 focus:bg-transparent focus:text-primary-dark font-semibold`}
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-primary-dark"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-secondary-light text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>
      
      {error && (
        <div className="p-3 rounded-lg text-sm bg-primary/10 text-secondary-light border border-secondary-light">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-secondary text-tetiary rounded-lg font-semibold hover:bg-secondary-light transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
