"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaArrowLeft } from "react-icons/fa6";
import {
  CreatePressureTestData,
  CreatePressureTestSchema,
  PressureTest,
} from "@/schemas/pressure_test";
import {
  usePressureTest,
  useCreatePressureTest,
  useUpdatePressureTest,
} from "@/hooks/usePressureTest";
import ErrorState from "../../../../../components/states/ErrorState";
import { extractApiError } from "@/lib/errors";

const mapPressureTestToForm = (
  pressureTest: PressureTest,
): CreatePressureTestData => ({
  client: pressureTest.client ?? "",
  location_address: pressureTest.location_address ?? "",
  manufacturer: pressureTest.manufacturer ?? "",
  manufacturing_date: pressureTest.manufacturing_date ?? "",
  serial_no: pressureTest.serial_no ?? "",
  truck_no: pressureTest.truck_no ?? "",
  tank_capacity: pressureTest.tank_capacity ?? 0,
  product_stored: pressureTest.product_stored ?? "",
  tank_type: pressureTest.tank_type ?? "",
  test_pressure: pressureTest.test_pressure ?? 0,
  working_pressure: pressureTest.working_pressure ?? 0,
  temperature: pressureTest.temperature ?? 0,
  test_duration: pressureTest.test_duration ?? 0,
  test_medium: pressureTest.test_medium ?? "",
  avrg_utm_gauge: pressureTest.avrg_utm_gauge ?? 0,
  safety_relief_valve_size: pressureTest.safety_relief_valve_size ?? "",
  safety_relief_valve_no: pressureTest.safety_relief_valve_no ?? "",
  date_of_test: pressureTest.date_of_test ?? "",
  next_test_date: pressureTest.next_test_date ?? "",
  result: pressureTest.result ?? "",
});

export default function StaffPressureTestPage() {
  const params = useParams();
  const code = typeof params?.code === "string" ? params.code : "";
  const {
    data: pressureTest,
    isLoading,
    isError,
    error,
    refetch,
  } = usePressureTest(code);
  const createPressureTest = useCreatePressureTest(code);
  const updatePressureTest = useUpdatePressureTest(code);
  const isNotFound = (error as any)?.response?.status === 404;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreatePressureTestData>({
    resolver: zodResolver(CreatePressureTestSchema),
    mode: "onBlur",
    defaultValues: {
      client: "",
      location_address: "",
      manufacturer: "",
      manufacturing_date: "",
      serial_no: "",
      truck_no: "",
      tank_capacity: 0,
      product_stored: "",
      tank_type: "",
      test_pressure: 0,
      working_pressure: 0,
      temperature: 0,
      test_duration: 0,
      test_medium: "",
      avrg_utm_gauge: 0,
      safety_relief_valve_size: "",
      safety_relief_valve_no: "",
      date_of_test: "",
      next_test_date: "",
      result: "",
    },
  });

  useEffect(() => {
    if (pressureTest) {
      reset(mapPressureTestToForm(pressureTest));
    }
  }, [pressureTest, reset]);

  const onSubmit = async (data: CreatePressureTestData) => {
    if (pressureTest) {
      await updatePressureTest.mutateAsync(data);
      return;
    }
    await createPressureTest.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-primary-light/20 p-6 text-secondary-text">
        Loading pressure test form...
      </div>
    );
  }

  if (isError && !isNotFound) {
    return (
      <ErrorState
        message="Unable to load pressure test details."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link
          href={`/portal/staff/projects/${code}`}
          className="inline-flex items-center gap-2 text-sm text-primary-dark hover:text-primary-light"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Project
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-primary-light/20 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-primary-dark">Pressure Test</h1>
        <p className="text-sm text-secondary-text mt-2">
          Execute and record the pressure test for project {code || "--"}.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-border bg-tetiary/80 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-primary-dark">Test Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-secondary-text">Client</label>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("client")}
              />
              {errors.client && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.client.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Location</label>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("location_address")}
              />
              {errors.location_address && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.location_address.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Manufacturer</label>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("manufacturer")}
              />
              {errors.manufacturer && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.manufacturer.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Manufacturing date</label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("manufacturing_date")}
              />
              {errors.manufacturing_date && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.manufacturing_date.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Serial number</label>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("serial_no")}
              />
              {errors.serial_no && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.serial_no.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Truck number</label>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("truck_no")}
              />
              {errors.truck_no && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.truck_no.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Tank capacity</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("tank_capacity", { valueAsNumber: true })}
              />
              {errors.tank_capacity && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.tank_capacity.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Product stored</label>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("product_stored")}
              />
              {errors.product_stored && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.product_stored.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Tank type</label>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("tank_type")}
              />
              {errors.tank_type && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.tank_type.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Test pressure</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("test_pressure", { valueAsNumber: true })}
              />
              {errors.test_pressure && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.test_pressure.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Working pressure</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("working_pressure", { valueAsNumber: true })}
              />
              {errors.working_pressure && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.working_pressure.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Temperature</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("temperature", { valueAsNumber: true })}
              />
              {errors.temperature && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.temperature.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Test duration</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("test_duration", { valueAsNumber: true })}
              />
              {errors.test_duration && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.test_duration.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Test medium</label>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("test_medium")}
              />
              {errors.test_medium && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.test_medium.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Average UTM gauge</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("avrg_utm_gauge", { valueAsNumber: true })}
              />
              {errors.avrg_utm_gauge && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.avrg_utm_gauge.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">
                Safety relief valve size
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("safety_relief_valve_size")}
              />
              {errors.safety_relief_valve_size && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.safety_relief_valve_size.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">
                Safety relief valve number
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("safety_relief_valve_no")}
              />
              {errors.safety_relief_valve_no && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.safety_relief_valve_no.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Date of test</label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("date_of_test")}
              />
              {errors.date_of_test && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.date_of_test.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Next test date</label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("next_test_date")}
              />
              {errors.next_test_date && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.next_test_date.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Result</label>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("result")}
              />
              {errors.result && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.result.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {(createPressureTest.error || updatePressureTest.error) && (
          <p className="text-xs text-secondary-light">
            {extractApiError(
              createPressureTest.error || updatePressureTest.error,
            )}
          </p>
        )}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              createPressureTest.isPending ||
              updatePressureTest.isPending
            }
            className="px-4 py-2 rounded-xl bg-secondary text-tetiary text-sm font-medium hover:bg-secondary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {updatePressureTest.isPending || createPressureTest.isPending
              ? "Saving..."
              : pressureTest
              ? "Update Pressure Test"
              : "Save Pressure Test"}
          </button>
        </div>
      </form>
    </div>
  );
}
