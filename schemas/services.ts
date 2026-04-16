import { z } from "zod";

export const ServiceTypeSchema = z.object({
    id: z.union([z.number(), z.string()]),
    name: z.string(),
    description: z.string().nullable(),
    is_active: z.union([z.boolean(), z.string(), z.number()]),
  })

export const CreateServiceTypeSchema = z.object({
  name: z.string().min(1, "Service type name is required"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

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

const CreateServiceRequestBaseSchema = z.object({
  company_name: z.string().min(1, "Name is required"),
  service_type_id: z.union([z.number(), z.string()]).nullable().optional(),
  custom_service: z.string().nullable().optional(),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  owner: z.string().min(1, "Client ID is required for admin created requests"),
});

const withServiceSelectionValidation = <T extends z.ZodTypeAny>(schema: T) =>
  schema.superRefine((data, context) => {
  const serviceTypeId = (data as { service_type_id?: string | number | null })
    .service_type_id;
  const hasServiceType =
    serviceTypeId !== null &&
    serviceTypeId !== undefined &&
    !(typeof serviceTypeId === "string" && serviceTypeId.trim() === "");
  const hasCustomService = Boolean(
    (data as { custom_service?: string | null }).custom_service?.trim(),
  );

  if (!hasServiceType && !hasCustomService) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["service_type_id"],
      message: "Select a service type or enter a custom service",
    });
  }
});

export const CreateServiceRequestSchema = withServiceSelectionValidation(
  CreateServiceRequestBaseSchema,
);

export const CreateServiceRequestWithoutOwnerSchema =
  withServiceSelectionValidation(
    CreateServiceRequestBaseSchema.omit({ owner: true }),
  );

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
export type CreateServiceTypeData = z.infer<typeof CreateServiceTypeSchema>
export type ServiceStats = z.infer<typeof ServiceStats>
export type ServiceStatus = z.infer<typeof ServiceStatusSchema> 
