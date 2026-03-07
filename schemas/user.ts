import { z } from "zod";

export const UserSchema = z.object({
  pk: z.number(),
  email: z.string().email(),
  full_name: z.string(),
  phone_number: z.string(),
  role: z.enum(["admin", "client", "staff"]),
  date_joined: z.string(),
  last_login: z.string(),
  is_verified: z.boolean(),
  portal: z.string(),
  user_id:z.string()
});

export type User = z.infer<typeof UserSchema>;