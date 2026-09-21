"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaArrowLeft } from "react-icons/fa6";
import {
  CreatePressureTestData,
  CreatePressureTestSchema,
  PressureTest,
} from "@/schemas/pressure_test";
import {
  usePressureTest,
  PressureTestResponse,
  useCreatePressureTest,
  useUpdatePressureTest,
} from "@/hooks/usePressureTest";
import { useProject } from "@/hooks/useProjects";
import { extractApiError } from "@/lib/errors";
import { addYearsToDateInput, formatDateInput } from "@/lib/dateHelpers";
import StepTankStorage from "./steps/StepTankStorage";
import StepTestReadings from "./steps/StepTestReadings";
import StepSafetyValve from "./steps/StepSafetyValve";
import StepReview from "./steps/StepReview";
import ErrorState from "./states/ErrorState";

const isAxiosNotFoundError = (queryError: unknown) => {
  if (!queryError || typeof queryError !== "object") return false;
  if (!("response" in queryError)) return false;
  const response = (queryError as { response?: { status?: number } }).response;
  return response?.status === 404;
};

const resolvePressureTestRecord = (
  data: PressureTestResponse,
): PressureTest | null => {
  if (!data) return null;

  if (Array.isArray(data)) {
    return data[0] ?? null;
  }

  if (typeof data === "object" && "results" in data) {
    return Array.isArray(data.results) ? (data.results[0] ?? null) : null;
  }

  if (typeof data === "object" && "id" in data) {
    return data as PressureTest;
  }

  return null;
};

type Props = { role: "admin" | "staff"; mode?: "create" | "edit" };
const STEPS = [
  "Tank & Storage",
  "Test Readings",
  "Safety Valve",
  "Review",
] as const;

const getDefaultValues = (): CreatePressureTestData => {
  const today = formatDateInput(new Date());
  return {
    storage_type: "mobile",
    client: "",
    client_representative: "",
    location_address: "",
    manufacturer: "",
    manufacturing_date: "",
    serial_no: "",
    truck_no: "",
    tank_capacity: 0,
    product_stored: "",
    tank_type: "carbon steel",
    test_pressure: 0,
    working_pressure: 0,
    temperature: 40,
    test_duration: 24,
    test_medium: "water",
    avrg_utm_gauge: 0,
    safety_relief_valve_size: "",
    safety_relief_valve_no: "",
    date_of_test: today,
    next_test_date: addYearsToDateInput(today, 2),
    result: "satisfactory",
    safety_valve_certificate: {
      date_of_issue: today,
      valve_manufacturer: "",
      manufacturing_year: "",
      valve_type: "Spring Loaded Pressure Safety Valve",
      number_of_valve: 0,
      valve_size: "",
      manufacturer_set_pressure: 0,
      valve_test_pressure: 0,
      design_temperature: "-20°C/+65°C",
      testing_standard: "API 527",
      type_of_test: "Set Pressure, Reseat Pressure, Leakage Test",
      test_medium: "water",
      result: "satisfactory",
      permit_no: "",
      calibration_date: today,
      recommended_due_date: addYearsToDateInput(today, 2),
    },
  };
};

const mapPressureTestToForm = (
  pressureTest: PressureTest,
): CreatePressureTestData => ({
  storage_type: pressureTest.storage_type ?? "mobile",
  client: pressureTest.client ?? "",
  client_representative: pressureTest.client_representative ?? "",
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

  safety_valve_certificate: {
    date_of_issue: pressureTest.safety_valve_certificate?.date_of_issue ?? "",
    valve_manufacturer:
      pressureTest.safety_valve_certificate?.valve_manufacturer ?? "",
    manufacturing_year:
      pressureTest.safety_valve_certificate?.manufacturing_year ?? "",
    valve_type:
      pressureTest.safety_valve_certificate?.valve_type ??
      "Spring Loaded Pressure Safety Valve",
    number_of_valve:
      pressureTest.safety_valve_certificate?.number_of_valve ?? 0,
    valve_size: pressureTest.safety_valve_certificate?.valve_size ?? "",
    manufacturer_set_pressure:
      pressureTest.safety_valve_certificate?.manufacturer_set_pressure ?? 0,
    valve_test_pressure:
      pressureTest.safety_valve_certificate?.valve_test_pressure ?? 0,
    design_temperature:
      pressureTest.safety_valve_certificate?.design_temperature ?? "",
    testing_standard:
      pressureTest.safety_valve_certificate?.testing_standard ?? "API 527",
    type_of_test:
      pressureTest.safety_valve_certificate?.type_of_test ??
      "Set Pressure, Reseat Pressure, Leakage Test",
    test_medium: pressureTest.safety_valve_certificate?.test_medium ?? "",
    result: pressureTest.safety_valve_certificate?.result ?? "satisfactory",
    permit_no: pressureTest.safety_valve_certificate?.permit_no ?? "",
    calibration_date:
      pressureTest.safety_valve_certificate?.calibration_date ?? "",
    recommended_due_date:
      pressureTest.safety_valve_certificate?.recommended_due_date ?? "",
  },
});

export default function PressureTestWizard({ role, mode = "create" }: Props) {
  const params = useParams();
  const router = useRouter();
  const code = typeof params?.code === "string" ? params.code : "";
  const isEditMode = mode === "edit";
  const [step, setStep] = useState(0);

  const { data: project } = useProject(code);
  const {
    data: pressureTestResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = usePressureTest(code);
  const createPressureTest = useCreatePressureTest(code);
  const isNotFound = isAxiosNotFoundError(error);
  const existingPressureTest = resolvePressureTestRecord(
    pressureTestResponse ?? null,
  );
  const updatePressureTest = useUpdatePressureTest(
    code,
    existingPressureTest?.id,
  );

  const methods = useForm<CreatePressureTestData>({
    resolver: zodResolver(CreatePressureTestSchema),
    mode: "onBlur",
    defaultValues: getDefaultValues(),
  });
  const {
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (!isEditMode || !existingPressureTest) return;
    reset(mapPressureTestToForm(existingPressureTest));
  }, [existingPressureTest, isEditMode, reset]);

  useEffect(() => {
    if (!project) return;
    if (!getValues("client"))
      setValue("client", project.company, { shouldDirty: false });
    if (!getValues("location_address"))
      setValue("location_address", project.location, { shouldDirty: false });
    if (!getValues("client_representative"))
      setValue("client_representative", project.owner?.full_name || "", {
        shouldDirty: false,
      });
  }, [project, getValues, setValue]);

  const onSubmit = async (data: CreatePressureTestData) => {
    if (isEditMode) {
      if (!existingPressureTest) return;
      await updatePressureTest.mutateAsync(data);
    } else {
      await createPressureTest.mutateAsync(data);
    }
    router.push(`/portal/${role}/projects/${code}/pressure-test/record`);
  };

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  if (isEditMode && isLoading)
    return (
      <div className="rounded-2xl border border-border bg-primary-light/20 p-6 text-secondary-text">
        Loading pressure test form...
      </div>
    );
  if (isEditMode && isError && !isNotFound)
    return (
      <ErrorState
        message="Unable to load pressure test details."
        onRetry={() => refetch()}
      />
    );
  if (isEditMode && (isNotFound || !existingPressureTest))
    return (
      <ErrorState
        message="No pressure test record found for this project yet."
        onRetry={() => refetch()}
      />
    );

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <div className="flex items-center">
          <Link
            href={`/portal/${role}/projects/${code}`}
            className="inline-flex items-center gap-2 text-sm text-primary-dark hover:text-primary-light"
          >
            <FaArrowLeft className="w-4 h-4" /> Back to Project
          </Link>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(i)}
              className={`shrink-0 min-w-[120px] sm:flex-1 text-center text-xs py-2 px-3 rounded-lg border transition-colors ${
                i === step
                  ? "bg-secondary text-tetiary border-secondary"
                  : "border-border text-secondary-text"
              }`}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 0 && <StepTankStorage />}
          {step === 1 && <StepTestReadings />}
          {step === 2 && <StepSafetyValve />}
          {step === 3 && <StepReview />}

          {((!isEditMode && createPressureTest.error) ||
            (isEditMode && updatePressureTest.error)) && (
            <p className="text-xs text-secondary-light">
              {extractApiError(
                isEditMode
                  ? updatePressureTest.error
                  : createPressureTest.error,
              )}
            </p>
          )}

          <div className="flex items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={goBack}
                className="px-4 py-2 rounded-xl border border-border text-sm text-primary-dark"
              >
                Back
              </button>
            ) : (
              <span />
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="px-4 py-2 rounded-xl bg-secondary text-tetiary text-sm font-medium"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-secondary text-tetiary text-sm font-medium disabled:opacity-60"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                    ? "Update Pressure Test"
                    : "Submit Pressure Test"}
              </button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
