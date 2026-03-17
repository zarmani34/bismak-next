import { z } from "zod";

// ---- Leak Test ----

export const LeakTestTankSchema = z.object({
  id: z.string(),
  tank_no: z.number(),
  product_stored: z.string(),
  capacity: z.number(),
  age_of_tank: z.number(),
  date_of_test: z.string(),
  remark: z.string(),
});

export const LeakTestSchema = z.object({
  id: z.string(),
  project: z.string(),
  station_name: z.string(),
  location: z.string(),
  date_of_test: z.string(),
  expiring_date: z.string(),
  equipment_tested: z.string(),
  result: z.string(),
  result_display: z.string(),
  tanks: z.array(LeakTestTankSchema),
  created_at: z.string(),
});

export const CreateLeakTestTankSchema = z.object({
  tank_no: z.number({ error: "Tank number is required" }),
  product_stored: z.string().min(1, "Product stored is required"),
  capacity: z.number({ error: "Capacity is required" }),
  age_of_tank: z.number({ error: "Age of tank is required" }),
  date_of_test: z.string().min(1, "Date of test is required"),
  remark: z.string().min(1, "Remark is required"),
});

export const CreateLeakTestSchema = z.object({
  station_name: z.string().min(1, "Station name is required"),
  location: z.string().min(1, "Location is required"),
  date_of_test: z.string().min(1, "Date of test is required"),
  expiring_date: z.string().min(1, "Expiring date is required"),
  equipment_tested: z.string().min(1, "Equipment tested is required"),
  result: z.string().min(1, "Result is required"),
  tanks: z.array(CreateLeakTestTankSchema).min(1, "At least one tank is required"),
});


// TypeScript types
export type LeakTest = z.infer<typeof LeakTestSchema>;
export type LeakTestTank = z.infer<typeof LeakTestTankSchema>;
export type CreateLeakTestData = z.infer<typeof CreateLeakTestSchema>;