"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaArrowLeft } from "react-icons/fa6";
import {
  CreateLeakTestData,
  CreateLeakTestSchema,
  LeakTest,
  LeakTestRemarkChoices,
  LeakTestTankProducts,
} from "@/schemas/leak_test";
import {
  useCreateLeakTest,
  useLeakTest,
  LeakTestResponse,
  useUpdateLeakTest,
} from "@/hooks/useLeakTest";
import { useProject } from "@/hooks/useProjects";
import ErrorState from "../states/ErrorState";
import { extractApiError } from "@/lib/errors";

type Props = {
  role: "admin" | "staff";
  mode?: "create" | "edit";
};

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const normalizeDateInput = (value?: string | null) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return formatDateInput(parsed);
  const candidate = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(candidate) ? candidate : "";
};

const addYearsToDateInput = (value: string, years: number) => {
  if (!value) return "";
  const normalizedValue = normalizeDateInput(value);
  if (!normalizedValue) return "";
  const date = new Date(normalizedValue);
  if (Number.isNaN(date.getTime())) return "";
  date.setFullYear(date.getFullYear() + years);
  return formatDateInput(date);
};

const getDefaultTank = (): CreateLeakTestData["tanks"][number] => ({
  tank_no: 1,
  product_stored: "pms",
  capacity: 0,
});

const mapLeakTestToForm = (leakTest: LeakTest): CreateLeakTestData => {
  const dateOfTest =
    normalizeDateInput(leakTest.date_of_test) || formatDateInput(new Date());
  const yearsToAdd = (leakTest.age_of_tank ?? 0) > 20 ? 1 : 2;
  const expiringDate =
    normalizeDateInput(leakTest.expiring_date) ||
    addYearsToDateInput(dateOfTest, yearsToAdd);

  return {
    station_name: leakTest.station_name ?? "",
    client_representative: leakTest.client_representative ?? "",
    location: leakTest.location ?? "",
    date_of_test: dateOfTest,
    expiring_date: expiringDate,
    age_of_tank: leakTest.age_of_tank ?? 0,
    remark: leakTest.remark ?? "good",
    tanks: leakTest.tanks?.length
      ? leakTest.tanks.map((tank) => ({
          tank_no: tank.tank_no,
          product_stored: tank.product_stored,
          capacity: tank.capacity,
        }))
      : [getDefaultTank()],
  };
};

const isAxiosNotFoundError = (queryError: unknown) => {
  if (!queryError || typeof queryError !== "object") return false;
  if (!("response" in queryError)) return false;
  const response = (queryError as { response?: { status?: number } }).response;
  return response?.status === 404;
};

const resolveLeakTestRecord = (data: LeakTestResponse): LeakTest | null => {
  if (!data) return null;

  if (Array.isArray(data)) {
    return data[0] ?? null;
  }

  if (typeof data === "object" && "results" in data) {
    return Array.isArray(data.results) ? (data.results[0] ?? null) : null;
  }

  if (typeof data === "object" && "id" in data) {
    return data as LeakTest;
  }

  return null;
};

export default function LeakTestFormPage({ role, mode = "create" }: Props) {
  const params = useParams();
  const router = useRouter();
  const code = typeof params?.code === "string" ? params.code : "";
  const isEditMode = mode === "edit";
  const { data: project } = useProject(code);
  const {
    data: leakTestResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useLeakTest(code);
  const createLeakTest = useCreateLeakTest(code);
  const updateLeakTest = useUpdateLeakTest(code);
  const isNotFound = isAxiosNotFoundError(error);
  const existingLeakTest = resolveLeakTestRecord(leakTestResponse ?? null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateLeakTestData>({
    resolver: zodResolver(CreateLeakTestSchema),
    mode: "onBlur",
    defaultValues: {
      station_name: "",
      client_representative: "",
      location: "",
      date_of_test: formatDateInput(new Date()),
      expiring_date: addYearsToDateInput(formatDateInput(new Date()), 2),
      age_of_tank: 0,
      remark: "good",
      tanks: [getDefaultTank()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tanks",
  });
  const ageOfTank = useWatch({
    control,
    name: "age_of_tank",
  });
  const dateOfTest = useWatch({
    control,
    name: "date_of_test",
  });

  useEffect(() => {
    if (!isEditMode) return;
    if (!existingLeakTest) return;
    reset(mapLeakTestToForm(existingLeakTest));
  }, [existingLeakTest, isEditMode, reset]);

  useEffect(() => {
    if (!project || isEditMode) return;

    if (!getValues("station_name")) {
      setValue("station_name", project.company, { shouldDirty: false });
    }

    if (!getValues("location")) {
      setValue("location", project.location, { shouldDirty: false });
    }

    if (!getValues("client_representative")) {
      setValue("client_representative", project.owner?.full_name || "", {
        shouldDirty: false,
      });
    }
  }, [getValues, isEditMode, project, setValue]);

  useEffect(() => {
    if (!dateOfTest) return;
    const yearsToAdd = ageOfTank > 20 ? 1 : 2;
    setValue("expiring_date", addYearsToDateInput(dateOfTest, yearsToAdd), {
      shouldDirty: true,
    });
  }, [ageOfTank, dateOfTest, setValue]);

  useEffect(() => {
    fields.forEach((field, index) => {
      const tankPath = `tanks.${index}.tank_no` as const;
      if (field.tank_no !== index + 1) {
        setValue(tankPath, index + 1, { shouldDirty: true });
      }
    });
  }, [fields, setValue]);

  const onSubmit = async (data: CreateLeakTestData) => {
    if (isEditMode) {
      if (!existingLeakTest) return;
      await updateLeakTest.mutateAsync(data);
      router.push(`/portal/${role}/projects/${code}/leak-test/record`);
      return;
    }
    await createLeakTest.mutateAsync(data);
    router.push(`/portal/${role}/projects/${code}/leak-test/record`);
  };

  if (isEditMode && isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-primary-light/20 p-6 text-secondary-text">
        Loading leak test form...
      </div>
    );
  }

  if (isEditMode && isError && !isNotFound) {
    return (
      <ErrorState
        message="Unable to load leak test details."
        onRetry={() => refetch()}
      />
    );
  }

  if (isEditMode && (isNotFound || !existingLeakTest)) {
    return (
      <ErrorState
        message="No leak test record found for this project yet."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link
          href={`/portal/${role}/projects/${code}`}
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
              <label className="text-xs text-secondary-text">
                Client representative
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("client_representative")}
              />
              {errors.client_representative && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.client_representative.message}
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
              <label className="text-xs text-secondary-text">Age of tank</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("age_of_tank", {
                  valueAsNumber: true,
                })}
              />
              {errors.age_of_tank && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.age_of_tank.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-secondary-text">Remark</label>
              <select
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                {...register("remark")}
              >
                {LeakTestRemarkChoices.map((remark) => (
                  <option key={remark} value={remark}>
                    {remark.charAt(0).toUpperCase() + remark.slice(1)}
                  </option>
                ))}
              </select>
              {errors.remark && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.remark.message}
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
              onClick={() =>
                append({
                  ...getDefaultTank(),
                  tank_no: fields.length + 1,
                })
              }
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-secondary-text">Tank number</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                    {...register(`tanks.${index}.tank_no`, {
                      valueAsNumber: true,
                    })}
                    readOnly
                  />
                  {errors.tanks?.[index]?.tank_no && (
                    <p className="text-xs text-secondary-light mt-1">
                      {errors.tanks[index]?.tank_no?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-secondary-text">Product stored</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                    {...register(`tanks.${index}.product_stored`)}
                  >
                    {LeakTestTankProducts.map((product) => (
                      <option key={product} value={product}>
                        {product.toUpperCase()}
                      </option>
                    ))}
                  </select>
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
              </div>
            </div>
          ))}
        </div>

        {((!isEditMode && createLeakTest.error) ||
          (isEditMode && updateLeakTest.error)) && (
          <p className="text-xs text-secondary-light">
            {extractApiError(
              isEditMode ? updateLeakTest.error : createLeakTest.error,
            )}
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
              : isEditMode
              ? "Update Leak Test"
              : "Submit Leak Test"}
          </button>
        </div>
      </form>
    </div>
  );
}
