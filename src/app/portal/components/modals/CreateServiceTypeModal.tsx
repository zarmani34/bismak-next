"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaXmark } from "react-icons/fa6";
import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import SecondaryButton from "@/src/components/buttons/SecondaryButton";
import {
  CreateServiceTypeData,
  CreateServiceTypeSchema,
} from "@/schemas/services";
import { useCreateServiceType } from "@/hooks/useServices";
import { extractApiError } from "@/lib/errors";

type CreateServiceTypeModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateServiceTypeModal({
  open,
  onClose,
}: CreateServiceTypeModalProps) {
  const createServiceType = useCreateServiceType();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateServiceTypeData>({
    resolver: zodResolver(CreateServiceTypeSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
      is_active: true,
    },
  });

  const handleModalClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateServiceTypeData) => {
    await createServiceType.mutateAsync(data);
    handleModalClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-primary-dark/40 backdrop-blur-[1px] z-50 flex items-center justify-center p-4"
      onClick={handleModalClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-primary-light bg-tetiary shadow-xl overflow-auto"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between border-b border-border p-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-dark/80">
                Create Service Type
              </h2>
              <p className="text-sm text-primary/70">
                Add a reusable service option for request creation.
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
            <div>
              <label className="text-xs text-primary-dark font-semibold tracking-wide">
                Service Type Name
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark"
                placeholder="e.g. Leak Test Certification"
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.name.message}
                </p>
              ) : null}
            </div>

            <div>
              <label className="text-xs text-primary-dark font-semibold tracking-wide">
                Description
              </label>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark"
                placeholder="Optional description for this service type"
                {...register("description")}
              />
              {errors.description ? (
                <p className="text-xs text-secondary-light mt-1">
                  {errors.description.message}
                </p>
              ) : null}
            </div>

            <label className="inline-flex items-center gap-3 text-sm text-primary-dark">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border"
                {...register("is_active")}
              />
              Active (available in request dropdown)
            </label>

            {createServiceType.error ? (
              <p className="text-xs text-secondary-light">
                {extractApiError(createServiceType.error)}
              </p>
            ) : null}
          </div>

          <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <button
              type="submit"
              className="flex justify-center rounded-2xl"
              disabled={isSubmitting || createServiceType.isPending}
            >
              <PrimaryButton
                tittle={
                  createServiceType.isPending ? "Saving..." : "Save Service Type"
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
