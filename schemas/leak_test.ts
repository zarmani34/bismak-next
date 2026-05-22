import { z } from "zod";

// ---- Leak Test ----
export const LeakTestTankProducts = ["ago", "pms", "dpk"] as const;
export const LeakTestRemarkChoices = ["good", "bad", "fair"] as const;

export const LeakTestTankSchema = z.object({
  id: z.string(),
  tank_no: z.number(),
  product_stored: z.enum(LeakTestTankProducts),
  capacity: z.number(),
});

export const LeakTestSchema = z.object({
  id: z.string(),
  project: z.string(),
  station_name: z.string(),
  client_representative: z.string().nullable().optional(),
  location: z.string(),
  date_of_test: z.string(),
  expiring_date: z.string(),
  age_of_tank: z.number(),
  remark: z.enum(LeakTestRemarkChoices),
  tanks: z.array(LeakTestTankSchema),
  created_at: z.string(),
});

export const CreateLeakTestTankSchema = z.object({
  tank_no: z.number({ error: "Tank number is required" }),
  product_stored: z.enum(LeakTestTankProducts, {
    error: "Product stored is required",
  }),
  capacity: z.number({ error: "Capacity is required" }),
});

export const CreateLeakTestSchema = z.object({
  station_name: z.string().min(1, "Station name is required"),
  client_representative: z.string().min(1, "Client representative is required"),
  location: z.string().min(1, "Location is required"),
  date_of_test: z.string().min(1, "Date of test is required"),
  expiring_date: z.string().min(1, "Expiring date is required"),
  age_of_tank: z.number({ error: "Age of tank is required" }),
  remark: z.enum(LeakTestRemarkChoices, {
    error: "Remark is required",
  }),
  tanks: z.array(CreateLeakTestTankSchema).min(1, "At least one tank is required"),
});


// TypeScript types
export type LeakTest = z.infer<typeof LeakTestSchema>;
export type LeakTestTank = z.infer<typeof LeakTestTankSchema>;
export type CreateLeakTestData = z.infer<typeof CreateLeakTestSchema>;
