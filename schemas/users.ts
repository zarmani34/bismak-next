import { z } from "zod";
import { User } from "@/schemas/user";

// Re-export the existing User type for the table — same shape, no duplication
export type UserListItem = User;

// ---- staff/admin schema ----

export const CreateStaffAdminSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phone_number: z.string().min(1, "Phone number is required"),
    role: z.enum(["staff", "admin"], {
      error: "Please select a role",
    }),
    password1: z.string().min(8, "Password must be at least 8 characters"),
    password2: z.string().min(1, "Please confirm password"),
  })
  .refine((data) => data.password1 === data.password2, {
    path: ["password2"],
    message: "Passwords do not match",
  });

export type CreateStaffAdminData = z.infer<typeof CreateStaffAdminSchema>;
