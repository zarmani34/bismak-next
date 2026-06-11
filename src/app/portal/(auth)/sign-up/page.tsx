"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { SignUpFormData, SignUpSchema } from "@/schemas/auth";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { FaEnvelope } from "react-icons/fa";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const { signUp, isLoading, error } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: SignUpFormData) => {
    const result = await signUp(data);
    if (result?.success) {
      setShowVerificationPopup(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="sr-only">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="First Name"
            {...register("first_name")}
            className={`w-full p-3 rounded-lg bg-primary-light/20 border ${
              errors.first_name
                ? "border-secondary-light"
                : "border-primary-dark"
            } text-primary-dark placeholder:text-primary-dark focus:outline-0 focus:bg-transparent focus:text-primary-dark font-semibold`}
            aria-invalid={errors.first_name ? "true" : "false"}
          />
          {errors.first_name && (
            <p className="text-secondary-light text-sm mt-1">
              {errors.first_name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="sr-only">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Last Name"
            {...register("last_name")}
            className={`w-full p-3 rounded-lg bg-primary-light/20 border ${
              errors.last_name
                ? "border-secondary-light"
                : "border-primary-dark"
            } text-primary-dark placeholder:text-primary-dark focus:outline-0 focus:bg-transparent focus:text-primary-dark font-semibold`}
            aria-invalid={errors.last_name ? "true" : "false"}
          />
          {errors.last_name && (
            <p className="text-secondary-light text-sm mt-1">
              {errors.last_name.message}
            </p>
          )}
        </div>
      </div>

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
        />
        {errors.email && (
          <p className="text-secondary-light text-sm mt-1">
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
            {...register("password1")}
            className={`w-full p-3 rounded-lg bg-primary-light/20 border ${
              errors.password1
                ? "border-secondary-light"
                : "border-primary-dark"
            } text-primary-dark placeholder:text-primary-dark focus:outline-0 focus:bg-transparent focus:text-primary-dark font-semibold`}
            aria-invalid={errors.password1 ? "true" : "false"}
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
        {errors.password1 && (
          <p className="text-secondary-light text-sm mt-1">
            {errors.password1.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="sr-only">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("password2")}
            className={`w-full p-3 rounded-lg bg-primary-light/20 border ${
              errors.password2
                ? "border-secondary-light"
                : "border-primary-dark"
            } text-primary-dark placeholder:text-primary-dark focus:outline-0 focus:bg-transparent focus:text-primary-dark font-semibold`}
            aria-invalid={errors.password2 ? "true" : "false"}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-primary-dark"
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password2 && (
          <p className="text-secondary-light text-sm mt-1">
            {errors.password2.message}
          </p>
        )}
      </div>

      {errors.root && (
        <div className="p-3 rounded-lg text-sm bg-red-50 text-secondary-light border border-secondary-light">
          {errors.root.message}
        </div>
      )}
      <div>
        <label htmlFor="company_name" className="sr-only">
          Company Name
        </label>
        <input
          id="company_name"
          type="text"
          placeholder="Company Name"
          {...register("company_name")}
          className={`w-full p-3 rounded-lg bg-primary-light/20 border ${
            errors.company_name
              ? "border-secondary-light"
              : "border-primary-dark"
          } text-primary-dark placeholder:text-primary-dark focus:outline-0 focus:bg-transparent focus:text-primary-dark font-semibold`}
          aria-invalid={errors.company_name ? "true" : "false"}
        />
        {errors.company_name && (
          <p className="text-secondary-light text-sm mt-1">
            {errors.company_name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="company_address" className="sr-only">
          Company Address
        </label>
        <input
          id="company_address"
          type="text"
          placeholder="Company Address (optional)"
          {...register("company_address")}
          className="w-full p-3 rounded-lg bg-primary-light/20 border border-primary-dark
      text-primary-dark placeholder:text-primary-dark focus:outline-0 
      focus:bg-transparent focus:text-primary-dark font-semibold"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-secondary text-tetiary rounded-lg font-semibold hover:bg-secondary-light transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Creating account..." : "Create Account"}
      </button>

      { showVerificationPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-tetiary rounded-xl p-8 max-w-sm w-full mx-4 text-center"
            style={{ boxShadow: "0 6px 18px rgba(26, 36, 33, 0.06)" }}
          >
            {/* Email icon */}
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-xl font-bold text-primary mb-2">
              Check your email
            </h2>
            <p className="text-sm text-muted mb-6">
              We sent a verification link to your email address. Please verify
              your email before signing in.
            </p>

            <button
              onClick={() => router.push("/portal/sign-in")}
              className="w-full py-3 bg-secondary text-white rounded-lg font-semibold 
          hover:bg-secondary-dark transition"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      )}
      {
        error && (
          <div className="p-3 rounded-lg text-sm bg-red-50 text-secondary-light border border-secondary-light">
            {error}
          </div>
        )
      }
    </form>
  );
}
