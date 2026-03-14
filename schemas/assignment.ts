import { z } from "zod";

const AssigneeSchema = z.object({
  full_name: z.string(),
  email: z.string().email(),
  user_id: z.string(),
  role: z.enum(["admin", "staff", "client"]),
});

export const AssignmentSchema = z.object({
  id: z.string(),
  project: z.string(),
  assignee: AssigneeSchema,
  assignment_role: z.string(),
  company: z.string(),
  assigned_by: z.string(),
});

export const CreateAssignmentSchema = z.object({
  assignee_id: z.string().min(1, "Assignee is required"),
  assignment_role: z.string().min(1, "Role is required"),
});

export type Assignment = z.infer<typeof AssignmentSchema>;
export type CreateAssignmentData = z.infer<typeof CreateAssignmentSchema>;
