"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { usePortal } from "../../context";


const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required") 
    .email("Please enter a valid email address"), 
  
  password: z
    .string()
    .min(1, "Password is required") 
    .min(8, "Password must be at least 8 characters"), 
});

type LoginFormData = z.infer<typeof loginSchema>;
interface LoginFormProps {
  portal: string;
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { portal } = usePortal();


  const {
    register,    
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    setError,    
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), 
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Logging in to", portal, "with data:", data);
      
      // TODO: Replace this with API call
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // set error manually
      // setError("root", {
      //   message: "Invalid credentials"
      // });
      
    } catch (error) {
      // Handle network error
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-secondary text-tetiary rounded-lg font-semibold hover:bg-secondary-light transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}