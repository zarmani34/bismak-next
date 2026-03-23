"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaArrowLeft } from "react-icons/fa6";
import {
  CreateLeakTestData,
  CreateLeakTestSchema,
  LeakTest,
} from "@/schemas/leak_test";
import {
  useLeakTest,
  useCreateLeakTest,
  useUpdateLeakTest,
} from "@/hooks/useLeakTest";
import ErrorState from "../../../../../components/states/ErrorState";
import { extractApiError } from "@/lib/errors";

const getDefaultTank = () => ({
  tank_no: 1,
  product_stored: "",
  capacity: 0,
  age_of_tank: 0,
  date_of_test: "",
  remark: "",
});

const mapLeakTestToForm = (leakTest: LeakTest): CreateLeakTestData => ({
  station_name: leakTest.station_name ?? "",
  location: leakTest.location ?? "",
  date_of_test: leakTest.date_of_test ?? "",
  expiring_date: leakTest.expiring_date ?? "",
  equipment_tested: leakTest.equipment_tested ?? "",
  result: leakTest.result ?? "",
  tanks: leakTest.tanks?.length
    ? leakTest.tanks.map((tank) => ({
        tank_no: tank.tank_no,
        product_stored: tank.product_stored,
        capacity: tank.capacity,
        age_of_tank: tank.age_of_tank,
        date_of_test: tank.date_of_test,
        remark: tank.remark,
      }))
    : [getDefaultTank()],
});

export default function StaffLeakTestPage() {
  const params = useParams();
  const code = typeof params?.code === "string" ? params.code : "";
  const {
    data: leakTest,
    isLoading,
    isError,
    error,
    refetch,
  } = useLeakTest(code);
  const createLeakTest = useCreateLeakTest(code);
  const updateLeakTest = useUpdateLeakTest(code);
  const isNotFound = (error as any)?.response?.status === 404;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateLeakTestData>({
    resolver: zodResolver(CreateLeakTestSchema),
    mode: "onBlur",
    defaultValues: {
      station_name: "",
      location: "",
      date_of_test: "",
      expiring_date: "",
      equipment_tested: "",
      result: "",
      tanks: [getDefaultTank()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tanks",
  });

  useEffect(() => {
    if (leakTest) {
      reset(mapLeakTestToForm(leakTest));
    }
  }, [leakTest, reset]);

  const onSubmit = async (data: CreateLeakTestData) => {
    // if (leakTest) {
    //   await updateLeakTest.mutateAsync(data);
    //   return;
    // }
    await createLeakTest.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-primary-light/20 p-6 text-secondary-text">
        Loading leak test form...
      </div>
    );
  }

  if (isError && !isNotFound) {
    return (
      <ErrorState
        message="Unable to load leak test details."
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
        <h1 className="text-2xl font-semibold text-primary-dark">Leak Test</h1>
        <p className="text-sm text-secondary-text mt-2">
          Execute and record the leak test for project {code || "--"}.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-border bg-tetiary/80 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-primary-dark">Test Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-secondary-text">Station name</label>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("station_name")}
              />
              {errors.station_name && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.station_name.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Location</label>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("location")}
              />
              {errors.location && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.location.message}
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
              <label className="text-xs text-secondary-text">Expiring date</label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("expiring_date")}
              />
              {errors.expiring_date && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.expiring_date.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Equipment tested</label>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("equipment_tested")}
              />
              {errors.equipment_tested && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.equipment_tested.message}
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

        <div className="rounded-xl border border-border bg-tetiary/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary-dark">Tanks</h2>
            <button
              type="button"
              onClick={() => append(getDefaultTank())}
              className="text-xs font-semibold text-secondary border border-secondary/40 px-3 py-1 rounded-full hover:bg-secondary/10 transition-colors"
            >
              Add Tank
            </button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-lg border border-border bg-primary-light/20 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-primary-dark">
                  Tank {index + 1}
                </p>
                {fields.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-xs text-secondary hover:text-secondary-dark"
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-secondary-text">Tank number</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                    {...register(`tanks.${index}.tank_no`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.tanks?.[index]?.tank_no && (
                    <p className="text-xs text-secondary-light mt-1">
                      {errors.tanks[index]?.tank_no?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-secondary-text">Product stored</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                    {...register(`tanks.${index}.product_stored`)}
                  />
                  {errors.tanks?.[index]?.product_stored && (
                    <p className="text-xs text-secondary-light mt-1">
                      {errors.tanks[index]?.product_stored?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-secondary-text">Capacity</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                    {...register(`tanks.${index}.capacity`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.tanks?.[index]?.capacity && (
                    <p className="text-xs text-secondary-light mt-1">
                      {errors.tanks[index]?.capacity?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-secondary-text">Age of tank</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                    {...register(`tanks.${index}.age_of_tank`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.tanks?.[index]?.age_of_tank && (
                    <p className="text-xs text-secondary-light mt-1">
                      {errors.tanks[index]?.age_of_tank?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-secondary-text">Date of test</label>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                    {...register(`tanks.${index}.date_of_test`)}
                  />
                  {errors.tanks?.[index]?.date_of_test && (
                    <p className="text-xs text-secondary-light mt-1">
                      {errors.tanks[index]?.date_of_test?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-secondary-text">Remark</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                    {...register(`tanks.${index}.remark`)}
                  />
                  {errors.tanks?.[index]?.remark && (
                    <p className="text-xs text-secondary-light mt-1">
                      {errors.tanks[index]?.remark?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {(createLeakTest.error || updateLeakTest.error) && (
          <p className="text-xs text-secondary-light">
            {extractApiError(createLeakTest.error || updateLeakTest.error)}
          </p>
        )}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={
              isSubmitting || createLeakTest.isPending || updateLeakTest.isPending
            }
            className="px-4 py-2 rounded-xl bg-secondary text-tetiary text-sm font-medium hover:bg-secondary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {updateLeakTest.isPending || createLeakTest.isPending
              ? "Saving..."
              : leakTest
              ? "Update Leak Test"
              : "Save Leak Test"}
          </button>
        </div>
      </form>
    </div>
  );
}
