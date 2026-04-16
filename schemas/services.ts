import { z } from "zod";
import { UserSchema } from "./user";

export const ServiceTypeSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    is_active: z.string(),
  })

export const ServiceStatusSchema = z.enum(["pending", "reviewed", "quoted", "accepted", "rejected", "in_progress", "completed"])

export const ServiceRequestListSchema = z.object({
  id: z.string(),
  service_name: z.string(),
  location: z.string(),
  status: ServiceStatusSchema,
  status_display: z.string(),
  owner_name: z.string(),
  created_at: z.string(),
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

    

export type ServiceRequest = z.infer<typeof ServiceRequestListSchema>
export type CreateServiceRequestData = z.infer<typeof CreateServiceRequestSchema>
export type ServiceType = z.infer<typeof ServiceTypeSchema>
export type ServiceStats = z.infer<typeof ServiceStats>
export type ServiceStatus = z.infer<typeof ServiceStatusSchema> 