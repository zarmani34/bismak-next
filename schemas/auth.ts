import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const SignUpSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password1: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    password2: z.string().min(1, "Please confirm your password"),
    company_name: z.string().min(1, "Company name is required"),
    company_address: z.string().optional(),
  })
  .refine((data) => data.password1 === data.password2, {
    path: ["password2"],
    message: "Passwords do not match",
  });

export type SignUpFormData = z.infer<typeof SignUpSchema>;


export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;


export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // error appears under confirmPassword field
  });

export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;