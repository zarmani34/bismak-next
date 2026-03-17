import { z } from "zod";

/**
 * PROJECT OWNER SCHEMA
 */
const ProjectOwnerSchema = z.object({
  full_name: z.string(),
  email: z.string().email(),
  user_id: z.string(),
  role: z.enum(["admin", "staff", "client"]),
});

/**
 * PROJECT LIST ITEM SCHEMA
 */
export const ProjectListItemSchema = z.object({
  code: z.string(),
  name: z.string(),
  company: z.string(),
  location: z.string(),
  details_url: z.string().url(),
  type: z.string().nullable(),
  status: z.enum(["planning", "in_progress", "completed", "on_hold", "cancelled"]),
  status_display: z.string(),
  due_date: z.string().nullable(),
  owner: z.string(),
  created_at: z.string(),
  type_display: z.string().optional(),
});

/**
 * PROJECT DETAIL SCHEMA
 */
export const ProjectDetailSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  company: z.string(),
  location: z.string(),
  status: z.enum(["planning", "in_progress", "completed", "on_hold", "cancelled"]),
  status_display: z.string(),
  type: z.string().nullable(),
  due_date: z.string().nullable(),
  description: z.string().nullable(),
  owner: ProjectOwnerSchema,
  assignments: z.array(z.unknown()),
  events: z.array(z.unknown()),
  pressure_test: z.unknown().nullable(),
  leak_test: z.unknown().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  type_display: z.string(),
});

/**
 * CREATE PROJECT SCHEMA
 */
export const CreateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  owner: z.string().min(1, "Client ID is required to create the project onbehalf of the client"), //user ID 
  type: z.enum(["Pressure_test", "Leak_test", "Calibration"], {
    message: "Project type is required",
  }),
});

/**
 * UPDATE PROJECT SCHEMA
 * fields can be optional for (PATCH) partial updates
 */
export const UpdateProjectSchema = CreateProjectSchema.partial();

export type ProjectListItem = z.infer<typeof ProjectListItemSchema>;
export type ProjectDetail = z.infer<typeof ProjectDetailSchema>;
export type CreateProjectData = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectData = z.infer<typeof UpdateProjectSchema>;
