"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const signUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      console.log("Signing up with data:", data);

      // TODO: Replace with API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      setError("root", {
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && (
        <div className="p-3 rounded-lg text-sm bg-red-50 text-secondary-light border border-secondary-light">
          {errors.root.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="sr-only">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="First Name"
            {...register("firstName")}
            className={`w-full p-3 rounded-lg bg-primary-light/20 border ${
              errors.firstName ? "border-secondary-light" : "border-primary-dark"
            } text-primary-dark placeholder:text-primary-dark focus:outline-0 focus:bg-transparent focus:text-primary-dark font-semibold`}
            aria-invalid={errors.firstName ? "true" : "false"}
          />
          {errors.firstName && (
            <p className="text-secondary-light text-sm mt-1">
              {errors.firstName.message}
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
            {...register("lastName")}
            className={`w-full p-3 rounded-lg bg-primary-light/20 border ${
              errors.lastName ? "border-secondary-light" : "border-primary-dark"
            } text-primary-dark placeholder:text-primary-dark focus:outline-0 focus:bg-transparent focus:text-primary-dark font-semibold`}
            aria-invalid={errors.lastName ? "true" : "false"}
          />
          {errors.lastName && (
            <p className="text-secondary-light text-sm mt-1">
              {errors.lastName.message}
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
            {...register("password")}
            className={`w-full p-3 rounded-lg bg-primary-light/20 border ${
              errors.password ? "border-secondary-light" : "border-primary-dark"
            } text-primary-dark placeholder:text-primary-dark focus:outline-0 focus:bg-transparent focus:text-primary-dark font-semibold`}
            aria-invalid={errors.password ? "true" : "false"}
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
          <p className="text-secondary-light text-sm mt-1">
            {errors.password.message}
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
            {...register("confirmPassword")}
            className={`w-full p-3 rounded-lg bg-primary-light/20 border ${
              errors.confirmPassword
                ? "border-secondary-light"
                : "border-primary-dark"
            } text-primary-dark placeholder:text-primary-dark focus:outline-0 focus:bg-transparent focus:text-primary-dark font-semibold`}
            aria-invalid={errors.confirmPassword ? "true" : "false"}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-primary-dark"
            aria-label={
              showConfirmPassword ? "Hide confirm password" : "Show confirm password"
            }
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-secondary-light text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-secondary text-tetiary rounded-lg font-semibold hover:bg-secondary-light transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
