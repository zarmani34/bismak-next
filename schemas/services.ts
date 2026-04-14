import { z } from "zod";
import { UserSchema } from "./user";

export const ServiceTypeSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    is_active: z.string(),
})

export const ServiceRequestSchema = z.object({
  id: z.string(),
  name: z.string(),
  service_type: ServiceTypeSchema.nullable(),  // full object
  custom_service: z.string().nullable(),
  service_name: z.string(),
  location: z.string(),
  description: z.string(),
  status: z.string(),
  status_display: z.string(),
  owner: UserSchema,
  created_at: z.string(),
  updated_at: z.string(),
})

export const CreateServiceRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  service_type_id: z.number().nullable().optional(),  // ID only
  custom_service: z.string().nullable().optional(),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
})

export const ServiceStats = z.object({
    total : z.number(),
    pending : z.number(),
    inProgress : z.number(), 
    reviewed : z.number(),
    quoted : z.number(),
    accepted : z.number(),
    rejected : z.number(),
    completed : z.number(),
})


export type ServiceRequest = z.infer<typeof ServiceRequestSchema>
export type CreateServiceRequestData = z.infer<typeof CreateServiceRequestSchema>
export type ServiceType = z.infer<typeof ServiceTypeSchema>
export type ServiceStats = z.infer<typeof ServiceStats>