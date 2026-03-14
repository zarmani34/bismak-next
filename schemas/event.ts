import { z } from "zod";


const EventCreatorSchema = z.object({
  full_name: z.string(),
  email: z.string().email(),
  user_id: z.string(),
  role: z.enum(["admin", "staff", "client"]),
});

export const EventSchema = z.object({
  id: z.string(),
  project: z.string(),
  title: z.string(),
  description: z.string(),
  created_by: EventCreatorSchema,
  created_at: z.string(),
  details_url: z.string(),
});

export const CreateEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export type Event = z.infer<typeof EventSchema>;
export type CreateEventData = z.infer<typeof CreateEventSchema>;