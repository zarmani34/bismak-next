import {z} from "zod";

export const PressureTestSchema = z.object({
  id: z.string(),
  project: z.string(),
  client: z.string(),
  location_address: z.string(),
  manufacturer: z.string(),
  manufacturing_date: z.string(),
  serial_no: z.string(),
  truck_no: z.string(),
  tank_capacity: z.number(),
  product_stored: z.string(),
  tank_type: z.string(),
  test_pressure: z.number(),
  working_pressure: z.number(),
  temperature: z.number(),
  test_duration: z.number(),
  test_medium: z.string(),
  avrg_utm_gauge: z.number(),
  safety_relief_valve_size: z.string(),
  safety_relief_valve_no: z.string(),
  date_of_test: z.string(),
  next_test_date: z.string(),
  result: z.string(),
  result_display: z.string(),
  created_at: z.string(),
});

export const CreatePressureTestSchema = PressureTestSchema.omit({
  id: true,
  project: true,
  result_display: true,
  created_at: true,
}).extend({
  client: z.string().min(1, "Client is required"),
  location_address: z.string().min(1, "Location is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  manufacturing_date: z.string().min(1, "Manufacturing date is required"),
  serial_no: z.string().min(1, "Serial number is required"),
  truck_no: z.string().min(1, "Truck number is required"),
  tank_capacity: z.number({ error: "Tank capacity is required" }),
  product_stored: z.string().min(1, "Product stored is required"),
  tank_type: z.string().min(1, "Tank type is required"),
  test_pressure: z.number({ error: "Test pressure is required" }),
  working_pressure: z.number({ error: "Working pressure is required" }),
  temperature: z.number({ error: "Temperature is required" }),
  test_duration: z.number({ error: "Test duration is required" }),
  test_medium: z.string().min(1, "Test medium is required"),
  avrg_utm_gauge: z.number({ error: "Average UTM gauge is required" }),
  safety_relief_valve_size: z.string().min(1, "Safety relief valve size is required"),
  safety_relief_valve_no: z.string().min(1, "Safety relief valve number is required"),
  date_of_test: z.string().min(1, "Date of test is required"),
  next_test_date: z.string().min(1, "Next test date is required"),
  result: z.string().min(1, "Result is required"),
});



export type PressureTest = z.infer<typeof PressureTestSchema>;
export type CreatePressureTestData = z.infer<typeof CreatePressureTestSchema>;