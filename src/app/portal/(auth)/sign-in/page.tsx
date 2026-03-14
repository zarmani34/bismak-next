"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { LoginFormData, LoginSchema } from "@/schemas/auth";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { extractApiError } from "@/lib/errors";


export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();
  const searchParams = useSearchParams();

  const next = searchParams.get("next");

  const {
    register,    
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    setError,    
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema), 
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data, next);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
     
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
        {/* Display email validation errors */}
        {errors.email && (
          <p id="email-error" className="text-secondary-light text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            // Register password field
            {...register("password")}
            className={`w-full p-3 rounded-lg bg-primary-light/20 border ${
              errors.password ? "border-secondary-light" : "border-primary-dark"
            } text-primary-dark placeholder:text-primary-dark focus:outline-0 focus:bg-transparent focus:text-primary-dark font-semibold`}
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {/* Password toggle button */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-primary-dark"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {/* Display password validation errors */}
        {errors.password && (
          <p id="password-error" className="text-secondary-light text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>
      {
        error && (
          <div className="p-3 rounded-lg text-sm bg-primary/10 text-secondary-light border border-secondary-light">
            {extractApiError(error)}
          </div>
        )
      }

      {/* Submit Button */}
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
