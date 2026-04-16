"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaXmark } from "react-icons/fa6";
import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import SecondaryButton from "@/src/components/buttons/SecondaryButton";
import {
  CreateServiceRequestData,
  CreateServiceRequestSchema,
  CreateServiceRequestWithoutOwnerSchema,
} from "@/schemas/services";
import { useCreateServiceRequest, useServiceTypes } from "@/hooks/useServices";
import { extractApiError } from "@/lib/errors";

type CreateServiceRequestModalProps = {
  open: boolean;
  onClose: () => void;
  role?: "staff" | "admin" | "client";
};

type CreateServiceRequestFormData = Omit<CreateServiceRequestData, "owner"> & {
  owner?: string;
};

export default function CreateServiceRequestModal({
  open,
  onClose,
  role,
}: CreateServiceRequestModalProps) {
  const createServiceRequest = useCreateServiceRequest();
  const {
    data: serviceTypes = [],
    isLoading: isServiceTypesLoading,
    isError: isServiceTypesError,
  } = useServiceTypes();
  const [selectedServiceOption, setSelectedServiceOption] = useState("");

  const formSchema = useMemo(
    () =>
      role === "admin"
        ? CreateServiceRequestSchema
        : CreateServiceRequestWithoutOwnerSchema,
    [role],
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateServiceRequestFormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      company_name: "",
      location: "",
      description: "",
      service_type_id: null,
      custom_service: "",
      owner: "",
    },
  });

  const requiresCustomService =
    selectedServiceOption === "custom" ||
    isServiceTypesError ||
    serviceTypes.length === 0;

  const handleServiceOptionChange = (value: string) => {
    setSelectedServiceOption(value);

    if (value === "custom" || value === "") {
      setValue("service_type_id", null, { shouldValidate: true });
      return;
    }

    setValue("service_type_id", value, {
      shouldValidate: true,
    });
    setValue("custom_service", "", { shouldValidate: true });
  };

  const handleModalClose = () => {
    reset();
    setSelectedServiceOption("");
    onClose();
  };

  const onSubmit = async (data: CreateServiceRequestFormData) => {
    const normalizeServiceTypeId = (
      value: CreateServiceRequestData["service_type_id"],
    ) => {
      if (value === null || value === undefined) return null;
      if (typeof value === "number") return value;
      const trimmed = value.trim();
      if (!trimmed) return null;
      return /^\d+$/.test(trimmed) ? Number(trimmed) : trimmed;
    };

    const payload = {
      company_name: data.company_name,
      location: data.location,
      description: data.description,
      service_type_id: requiresCustomService
        ? null
        : normalizeServiceTypeId(data.service_type_id),
      custom_service: requiresCustomService
        ? data.custom_service?.trim() || null
        : null,
    };
    const requestPayload =
      role === "admin"
        ? ({ ...payload, owner: data.owner } as CreateServiceRequestData)
        : (payload as CreateServiceRequestData);
    await createServiceRequest.mutateAsync(requestPayload);
    handleModalClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-primary-dark/40 backdrop-blur-[1px] z-50 flex items-center justify-center p-4"
      onClick={handleModalClose}
    >
      <div
        className="w-full max-w-2xl max-h-3/4 rounded-2xl border border-primary-light bg-tetiary shadow-xl overflow-auto"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between border-b border-border p-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-dark/80">
                Create Service Request
              </h2>
              <p className="text-sm text-primary/70">
                Fill in details to submit a new service request.
              </p>
            </div>
            <button
              type="button"
              onClick={handleModalClose}
              className="text-primary/60 hover:text-secondary-dark hover:scale-110 transition-colors"
            >
              <FaXmark className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-primary-dark font-semibold tracking-wide">
                  Company Name
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Client company"
                  {...register("company_name")}
                />
                {errors.company_name && (
                  <p className="text-xs text-secondary-light mt-1">
                    {errors.company_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs text-primary-dark font-semibold tracking-wide">
                  Location
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Project location"
                  {...register("location")}
                />
                {errors.location && (
                  <p className="text-xs text-secondary-light mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {role === "admin" ? (
                <div>
                  <label className="text-xs text-primary-dark font-semibold tracking-wide">
                    Client User ID
                  </label>
                  <input
                    className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. BE-CL-0001"
                    {...register("owner")}
                  />
                  {errors.owner && (
                    <p className="text-xs text-secondary-light mt-1">
                      {errors.owner.message}
                    </p>
                  )}
                </div>
              ) : null}

              <div>
                <label className="text-xs text-primary-dark font-semibold tracking-wide">
                  Service Type
                </label>
                <select
                  value={selectedServiceOption}
                  onChange={(event) =>
                    handleServiceOptionChange(event.target.value)
                  }
                  className="mt-1 w-full rounded-2xl border border-border px-4 py-3 bg-primary/20 text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  disabled={isServiceTypesLoading}
                >
                  <option value="" disabled>
                    {isServiceTypesLoading
                      ? "Loading service types..."
                      : "Select service type"}
                  </option>

                  {serviceTypes.map((serviceType) => (
                    <option key={serviceType.id} value={String(serviceType.id)}>
                      {serviceType.name}
                    </option>
                  ))}

                  <option value="custom">Not Listed (Custom Service)</option>
                </select>
                {errors.service_type_id && (
                  <p className="text-xs text-secondary-light mt-1">
                    {errors.service_type_id.message}
                  </p>
                )}
                {isServiceTypesError ? (
                  <p className="text-xs text-secondary-light mt-1">
                    Unable to load service types. Enter a custom service below.
                  </p>
                ) : null}
              </div>
            </div>

            {requiresCustomService ? (
              <div>
                <label className="text-xs text-primary-dark font-semibold tracking-wide">
                  Custom Service
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Describe the required service"
                  {...register("custom_service")}
                />
                {errors.custom_service && (
                  <p className="text-xs text-secondary-light mt-1">
                    {errors.custom_service.message}
                  </p>
                )}
              </div>
            ) : null}

            <div>
              <label className="text-xs text-primary-dark font-semibold tracking-wide">
                Description
              </label>
              <textarea
                rows={4}
                className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Describe request scope and expectations"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {createServiceRequest.error ? (
              <p className="text-xs text-secondary-light">
                {extractApiError(createServiceRequest.error)}
              </p>
            ) : null}
          </div>

          <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <button
              type="submit"
              className="flex justify-center rounded-2xl"
              disabled={isSubmitting || createServiceRequest.isPending}
            >
              <PrimaryButton
                tittle={
                  createServiceRequest.isPending ? "Saving..." : "Save Request"
                }
              />
            </button>
            <button
              type="button"
              className="flex justify-center bg-secondary rounded-2xl"
              onClick={handleModalClose}
            >
              <SecondaryButton tittle="Cancel" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
