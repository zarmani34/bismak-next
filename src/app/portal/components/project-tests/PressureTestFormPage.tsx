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
import { useProject } from "@/hooks/useProjects";
import ErrorState from "../states/ErrorState";
import { extractApiError } from "@/lib/errors";

type Props = {
  role: "admin" | "staff";
};

type FieldConfig = {
  name: keyof CreatePressureTestData;
  label: string;
  type: "text" | "date" | "number" | "select";
  options?: Array<{ label: string; value: string }>;
};

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addYearsToDateInput = (value: string, years: number) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  date.setFullYear(date.getFullYear() + years);
  return formatDateInput(date);
};

const getDefaultPressureTestValues = (): CreatePressureTestData => {
  const today = formatDateInput(new Date());
  return {
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
    temperature: 40,
    test_duration: 0,
    test_medium: "",
    avrg_utm_gauge: 0,
    safety_relief_valve_size: "",
    safety_relief_valve_no: "",
    date_of_test: today,
    next_test_date: addYearsToDateInput(today, 2),
    result: "satisfactory",
  };
};

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
  temperature: pressureTest.temperature ?? 40,
  test_duration: pressureTest.test_duration ?? 0,
  test_medium: pressureTest.test_medium ?? "",
  avrg_utm_gauge: pressureTest.avrg_utm_gauge ?? 0,
  safety_relief_valve_size: pressureTest.safety_relief_valve_size ?? "",
  safety_relief_valve_no: pressureTest.safety_relief_valve_no ?? "",
  date_of_test: pressureTest.date_of_test ?? "",
  next_test_date: pressureTest.next_test_date ?? "",
  result: pressureTest.result ?? "satisfactory",
});

const FIELDS: FieldConfig[] = [
  { name: "client", label: "Client", type: "text" },
  { name: "location_address", label: "Location", type: "text" },
  { name: "manufacturer", label: "Manufacturer", type: "text" },
  { name: "manufacturing_date", label: "Manufacturing date", type: "date" },
  { name: "serial_no", label: "Serial number", type: "text" },
  { name: "truck_no", label: "Truck number", type: "text" },
  { name: "tank_capacity", label: "Tank capacity", type: "number" },
  { name: "product_stored", label: "Product stored", type: "text" },
  { name: "tank_type", label: "Tank type", type: "text" },
  { name: "test_pressure", label: "Test pressure", type: "number" },
  { name: "working_pressure", label: "Working pressure", type: "number" },
  { name: "temperature", label: "Temperature", type: "number" },
  { name: "test_duration", label: "Test duration", type: "number" },
  { name: "test_medium", label: "Test medium", type: "text" },
  { name: "avrg_utm_gauge", label: "Average UTM gauge", type: "number" },
  {
    name: "safety_relief_valve_size",
    label: "Safety relief valve size",
    type: "text",
  },
  {
    name: "safety_relief_valve_no",
    label: "Safety relief valve number",
    type: "text",
  },
  { name: "date_of_test", label: "Date of test", type: "date" },
  { name: "next_test_date", label: "Next test date", type: "date" },
  {
    name: "result",
    label: "Result",
    type: "select",
    options: [
      { label: "Satisfactory", value: "satisfactory" },
      { label: "Not satisfactory", value: "not_satisfactory" },
    ],
  },
];

export default function PressureTestFormPage({ role }: Props) {
  const params = useParams();
  const code = typeof params?.code === "string" ? params.code : "";
  const { data: project } = useProject(code);
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
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreatePressureTestData>({
    resolver: zodResolver(CreatePressureTestSchema),
    mode: "onBlur",
    defaultValues: getDefaultPressureTestValues(),
  });

  const dateOfTest = watch("date_of_test");

  useEffect(() => {
    if (!pressureTest) return;
    reset(mapPressureTestToForm(pressureTest));
  }, [pressureTest, reset]);

  useEffect(() => {
    if (!project) return;

    if (!getValues("client")) {
      setValue("client", project.company, { shouldDirty: false });
    }

    if (!getValues("location_address")) {
      setValue("location_address", project.location, { shouldDirty: false });
    }

    if (!getValues("temperature")) {
      setValue("temperature", 40, { shouldDirty: false });
    }
  }, [project, getValues, setValue]);

  useEffect(() => {
    if (!dateOfTest) return;
    setValue("next_test_date", addYearsToDateInput(dateOfTest, 2), {
      shouldDirty: true,
    });
  }, [dateOfTest, setValue]);

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
          href={`/portal/${role}/projects/${code}`}
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
            {FIELDS.map((field) => {
              const errorMessage = (errors as Record<string, any>)[field.name]
                ?.message as string | undefined;
              const registerOptions =
                field.type === "number" ? { valueAsNumber: true } : undefined;

              return (
                <div key={field.name}>
                  <label className="text-xs text-secondary-text">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                      {...register(field.name, registerOptions)}
                    >
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
                      {...register(field.name, registerOptions)}
                    />
                  )}
                  {errorMessage && (
                    <p className="text-xs text-secondary-light mt-1">{errorMessage}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {(createPressureTest.error || updatePressureTest.error) && (
          <p className="text-xs text-secondary-light">
            {extractApiError(createPressureTest.error || updatePressureTest.error)}
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
