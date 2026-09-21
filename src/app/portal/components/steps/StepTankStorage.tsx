"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { useState } from "react";
import { CreatePressureTestData } from "@/schemas/pressure_test";
import { useTankLookup } from "@/hooks/useTankLookup";
import { Field } from "../FormFields";

const inputCls = "w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark";

export default function StepTankStorage() {
  const { register, control, setValue, formState: { errors } } = useFormContext<CreatePressureTestData>();
  const storageType = useWatch({ control, name: "storage_type" });
  const [lookupKey, setLookupKey] = useState("");
  const [applied, setApplied] = useState(false);
  const param = storageType === "mobile" ? "truck_no" : "serial_no";
  const { data: match, isFetching } = useTankLookup(param, lookupKey);

  const applyMatch = () => {
    if (!match) return;
    setValue("manufacturer", match.manufacturer, { shouldDirty: true });
    setValue("manufacturing_date", match.manufacturing_date, { shouldDirty: true });
    setValue("tank_capacity", match.tank_capacity, { shouldDirty: true });
    setValue("product_stored", match.product_stored, { shouldDirty: true });
    setValue("tank_type", match.tank_type, { shouldDirty: true });
    setValue("serial_no", match.serial_no, { shouldDirty: true });
    if (match.truck_no) setValue("truck_no", match.truck_no, { shouldDirty: true });
  };

  return (
    <div className="rounded-xl border border-border bg-tetiary/80 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-primary-dark">Tank &amp; Storage</h2>

      <div className="flex sm:items-center flex-col sm:flex-row gap-3">
        <span className="text-xl text-primary-dark font-semibold">Storage type</span>
        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          {(["mobile", "normal"] as const).map((option) => (
            <button key={option} type="button"
              onClick={() => setValue("storage_type", option, { shouldDirty: true })}
              className={`px-4 py-2 text-sm ${storageType === option ? "bg-secondary text-tetiary" : "bg-primary-light/20 text-primary-dark"}`}>
              {option === "mobile" ? "Mobile (Truck Tanker)" : "Normal (Fixed Storage)"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-secondary-text">
          Search by {storageType === "mobile" ? "truck number" : "serial number"} to prefill from a past test
        </label>
        <input
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark "
          value={lookupKey}
          onChange={(e) => { setLookupKey(e.target.value); setApplied(false); }}
          placeholder={storageType === "mobile" ? "e.g. T9432LA" : "e.g. 21/YE-008"}
        />

        {isFetching && <p className="text-xs text-secondary-text mt-1">Searching...</p>}

        {!isFetching && match && (
          <button
            type="button"
            onClick={applyMatch}
            className={`mt-2 w-full text-left rounded-lg border px-3 py-2 transition-colors ${
              applied ? "border-secondary bg-secondary/10" : "border-secondary/40 bg-secondary/5 hover:bg-secondary/10"
            }`}
          >
            <p className="text-sm font-medium text-primary-dark">
              {match.manufacturer} — {match.tank_capacity}L {match.product_stored}
            </p>
            <p className="text-xs text-secondary-text mt-0.5">
              Serial {match.serial_no}{match.truck_no ? ` · Truck ${match.truck_no}` : ""}
              {applied ? " · applied" : " · tap to use this tank"}
            </p>
          </button>
        )}

        {!isFetching && !match && lookupKey.trim().length > 1 && (
          <div className="mt-2 w-full text-left rounded-lg border border-secondary px-3 py-2  bg-primary-light/20">
            <p className="text-xs text-secondary mt-1">No previous match — fill in the details below.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Manufacturer" error={errors.manufacturer?.message}>
          <input className={inputCls} {...register("manufacturer")} />
        </Field>
        <Field label="Manufacturing date" error={errors.manufacturing_date?.message}>
          <input type="date" className={inputCls} {...register("manufacturing_date")} />
        </Field>
        <Field label="Serial number" error={errors.serial_no?.message}>
          <input className={inputCls} {...register("serial_no")} />
        </Field>
        {storageType === "mobile" && (
          <Field label="Truck number" error={errors.truck_no?.message}>
            <input className={inputCls} {...register("truck_no")} />
          </Field>
        )}
        <Field label="Tank capacity (L)" error={errors.tank_capacity?.message}>
          <input type="number" className={inputCls} {...register("tank_capacity", { valueAsNumber: true })} />
        </Field>
        <Field label="Product stored" error={errors.product_stored?.message}>
          <input className={inputCls} {...register("product_stored")} />
        </Field>
        <Field label="Tank type" error={errors.tank_type?.message}>
          <input className={inputCls} {...register("tank_type")} />
        </Field>
      </div>
    </div>
  );
}