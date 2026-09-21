"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { CreatePressureTestData } from "@/schemas/pressure_test";
import { usePermitLookup } from "@/hooks/usePermitLookup";
import { Field } from "../FormFields";
import { addYearsToDateInput } from "@/lib/dateHelpers";

const inputCls = "w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark";

export default function StepSafetyValve() {
  const { register, control, setValue, formState: { errors } } = useFormContext<CreatePressureTestData>();
  const client = useWatch({ control, name: "client" });
  const dateOfTest = useWatch({ control, name: "date_of_test" });
  const calibrationDate = useWatch({ control, name: "safety_valve_certificate.calibration_date" });
  const valveSize = useWatch({ control, name: "safety_valve_certificate.valve_size" });
  const numberOfValve = useWatch({ control, name: "safety_valve_certificate.number_of_valve" });
  const { data: latest } = usePermitLookup(client);

  useEffect(() => {
    if (!dateOfTest) return;
    setValue("safety_valve_certificate.date_of_issue", dateOfTest, { shouldDirty: true });
    setValue("safety_valve_certificate.calibration_date", dateOfTest, { shouldDirty: true });
  }, [dateOfTest, setValue]);

  useEffect(() => {
    if (!calibrationDate) return;
    setValue("safety_valve_certificate.recommended_due_date", addYearsToDateInput(calibrationDate, 2), { shouldDirty: true });
  }, [calibrationDate, setValue]);

  useEffect(() => {
    if (latest?.permit_no) setValue("safety_valve_certificate.permit_no", latest.permit_no, { shouldDirty: false });
  }, [latest, setValue]);

  // keep legacy PressureTest.safety_relief_valve_* fields in sync so the backend record stays populated
  useEffect(() => {
    setValue("safety_relief_valve_size", valveSize || "", { shouldDirty: true });
  }, [valveSize, setValue]);
  useEffect(() => {
    setValue("safety_relief_valve_no", numberOfValve ? String(numberOfValve) : "", { shouldDirty: true });
  }, [numberOfValve, setValue]);

  return (
    <div className="rounded-xl border border-border bg-tetiary/80 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-primary-dark">Safety Valve (PSV)</h2>
      <p className="text-xs text-secondary-text">Client and location carry over automatically — nothing to re-enter here.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Valve manufacturer" error={errors.safety_valve_certificate?.valve_manufacturer?.message}>
          <input className={inputCls} {...register("safety_valve_certificate.valve_manufacturer")} />
        </Field>
        <Field label="Manufacturing year" error={errors.safety_valve_certificate?.manufacturing_year?.message}>
          <input className={inputCls} {...register("safety_valve_certificate.manufacturing_year")} />
        </Field>
        <Field label="Valve type" error={errors.safety_valve_certificate?.valve_type?.message}>
          <input className={inputCls} {...register("safety_valve_certificate.valve_type")} />
        </Field>
        <Field label="Number of valves" error={errors.safety_valve_certificate?.number_of_valve?.message}>
          <input type="number" className={inputCls} {...register("safety_valve_certificate.number_of_valve", { valueAsNumber: true })} />
        </Field>
        <Field label="Valve size" error={errors.safety_valve_certificate?.valve_size?.message}>
          <input className={inputCls} {...register("safety_valve_certificate.valve_size")} />
        </Field>
        <Field label="Manufacturer set pressure" error={errors.safety_valve_certificate?.manufacturer_set_pressure?.message}>
          <input type="number" className={inputCls} {...register("safety_valve_certificate.manufacturer_set_pressure", { valueAsNumber: true })} />
        </Field>
        <Field label="Valve test pressure" error={errors.safety_valve_certificate?.valve_test_pressure?.message}>
          <input type="number" className={inputCls} {...register("safety_valve_certificate.valve_test_pressure", { valueAsNumber: true })} />
        </Field>
        <Field label="Design temperature" error={errors.safety_valve_certificate?.design_temperature?.message}>
          <input className={inputCls} {...register("safety_valve_certificate.design_temperature")} />
        </Field>
        <Field label="Testing standard" error={errors.safety_valve_certificate?.testing_standard?.message}>
          <input className={inputCls} {...register("safety_valve_certificate.testing_standard")} />
        </Field>
        <Field label="Type of test" error={errors.safety_valve_certificate?.type_of_test?.message}>
          <input className={inputCls} {...register("safety_valve_certificate.type_of_test")} />
        </Field>
        <Field label="Test medium" error={errors.safety_valve_certificate?.test_medium?.message}>
          <input className={inputCls} {...register("safety_valve_certificate.test_medium")} />
        </Field>
        <Field label="Permit number" error={errors.safety_valve_certificate?.permit_no?.message}>
          <input className={inputCls} {...register("safety_valve_certificate.permit_no")} />
        </Field>
        <Field label="Date of issue" error={errors.safety_valve_certificate?.date_of_issue?.message}>
          <input type="date" className={inputCls} {...register("safety_valve_certificate.date_of_issue")} />
        </Field>
        <Field label="Calibration date" error={errors.safety_valve_certificate?.calibration_date?.message}>
          <input type="date" className={inputCls} {...register("safety_valve_certificate.calibration_date")} />
        </Field>
        <Field label="Recommended due date (auto)" error={errors.safety_valve_certificate?.recommended_due_date?.message}>
          <input type="date" className={inputCls} {...register("safety_valve_certificate.recommended_due_date")} />
        </Field>
        <Field label="Result">
          <select className={inputCls} {...register("safety_valve_certificate.result")}>
            <option value="satisfactory">Satisfactory</option>
            <option value="not_satisfactory">Not satisfactory</option>
          </select>
        </Field>
      </div>
    </div>
  );
}