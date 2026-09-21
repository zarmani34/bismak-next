"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { CreatePressureTestData } from "@/schemas/pressure_test";
import { Field } from "../FormFields";
import { addYearsToDateInput } from "@/lib/dateHelpers";

const inputCls = "w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark";
const MULTIPLIERS = [1.5, 1.6, 1.8];

export default function StepTestReadings() {
  const { register, control, setValue, formState: { errors } } = useFormContext<CreatePressureTestData>();
  const workingPressure = useWatch({ control, name: "working_pressure" });
  const dateOfTest = useWatch({ control, name: "date_of_test" });

  useEffect(() => {
    if (!dateOfTest) return;
    setValue("next_test_date", addYearsToDateInput(dateOfTest, 2), { shouldDirty: true });
  }, [dateOfTest, setValue]);

  return (
    <div className="rounded-xl border border-border bg-tetiary/80 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-primary-dark">Test Readings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Working pressure (BAR)" error={errors.working_pressure?.message}>
          <input type="number" className={inputCls} {...register("working_pressure", { valueAsNumber: true })} />
        </Field>

        <Field label="Test pressure (BAR)" error={errors.test_pressure?.message}>
          <input type="number" className={inputCls} {...register("test_pressure", { valueAsNumber: true })} />
          <div className="flex gap-2 mt-1">
            {MULTIPLIERS.map((m) => (
              <button key={m} type="button" disabled={!workingPressure}
                onClick={() => setValue("test_pressure", Number((workingPressure * m).toFixed(2)), { shouldDirty: true })}
                className="text-xs px-2 py-1 rounded-md border border-border text-secondary-text disabled:opacity-40">
                ×{m}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Temperature (°C)" error={errors.temperature?.message}>
          <input type="number" className={inputCls} {...register("temperature", { valueAsNumber: true })} />
        </Field>
        <Field label="Test duration (hrs)" error={errors.test_duration?.message}>
          <input type="number" className={inputCls} {...register("test_duration", { valueAsNumber: true })} />
        </Field>
        <Field label="Test medium" error={errors.test_medium?.message}>
          <input className={inputCls} {...register("test_medium")} />
        </Field>
        <Field label="Average UTM gauge" error={errors.avrg_utm_gauge?.message}>
          <input type="number" className={inputCls} {...register("avrg_utm_gauge", { valueAsNumber: true })} />
        </Field>
        <Field label="Date of test" error={errors.date_of_test?.message}>
          <input type="date" className={inputCls} {...register("date_of_test")} />
        </Field>
        <Field label="Next test date (auto)" error={errors.next_test_date?.message}>
          <input type="date" className={inputCls} {...register("next_test_date")} />
        </Field>
        <Field label="Result">
          <select className={inputCls} {...register("result")}>
            <option value="satisfactory">Satisfactory</option>
            <option value="not_satisfactory">Not satisfactory</option>
          </select>
        </Field>
      </div>
    </div>
  );
}