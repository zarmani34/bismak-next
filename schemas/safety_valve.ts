import { z } from "zod";

export const SafetyValveCertificateSchema = z.object({
  id: z.string(),
  certificate_no: z.string(),
  date_of_issue: z.string(),
  valve_manufacturer: z.string(),
  manufacturing_year: z.string(),
  valve_type: z.string(),
  number_of_valve: z.number(),
  valve_size: z.string(),
  manufacturer_set_pressure: z.number(),
  valve_test_pressure: z.number(),
  design_temperature: z.string(),
  testing_standard: z.string(),
  type_of_test: z.string(),
  test_medium: z.string(),
  result: z.string(),
  result_display: z.string(),
  permit_no: z.string().optional(),
  calibration_date: z.string(),
  recommended_due_date: z.string(),
});

export const CreateSafetyValveCertificateSchema = SafetyValveCertificateSchema.omit({
  id: true,
  certificate_no: true,
  result_display: true,
}).extend({
  valve_manufacturer: z.string().min(1, "Valve manufacturer is required"),
  manufacturing_year: z.string().min(1, "Manufacturing year is required"),
  valve_type: z.string().min(1, "Valve type is required"),
  number_of_valve: z.number({ error: "Number of valves is required" }),
  valve_size: z.string().min(1, "Valve size is required"),
  manufacturer_set_pressure: z.number({ error: "Manufacturer set pressure is required" }),
  valve_test_pressure: z.number({ error: "Valve test pressure is required" }),
  design_temperature: z.string().min(1, "Design temperature is required"),
  testing_standard: z.string().min(1, "Testing standard is required"),
  type_of_test: z.string().min(1, "Type of test is required"),
  test_medium: z.string().min(1, "Test medium is required"),
  result: z.string().min(1, "Result is required"),
  calibration_date: z.string().min(1, "Calibration date is required"),
  recommended_due_date: z.string().min(1, "Recommended due date is required"),
});

export type SafetyValveCertificate = z.infer<typeof SafetyValveCertificateSchema>;
export type CreateSafetyValveCertificateData = z.infer<typeof CreateSafetyValveCertificateSchema>;