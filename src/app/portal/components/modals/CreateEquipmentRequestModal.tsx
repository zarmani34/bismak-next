"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaXmark } from "react-icons/fa6";
import { useCreateEquipmentRequest, useEquipmentList } from "@/hooks/useEquipment";
import { extractApiError } from "@/lib/errors";

const formSchema = z.object({
  equipment_id: z.string().min(1, "Select equipment"),
  reason: z.string().min(1, "Reason is required"),
  date_needed: z.string().min(1, "Date needed is required"),
});

type FormData = z.infer<typeof formSchema>;

type CreateEquipmentRequestModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateEquipmentRequestModal({
  open,
  onClose,
}: CreateEquipmentRequestModalProps) {
  const createRequest = useCreateEquipmentRequest();
  const { data: equipment = [], isLoading } = useEquipmentList();

  const availableEquipment = useMemo(
    () => equipment.filter((item) => item.status === "available"),
    [equipment],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipment_id: "",
      reason: "",
      date_needed: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    await createRequest.mutateAsync(data);
    handleClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-primary-dark/40 backdrop-blur-[1px] z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-primary-light bg-tetiary shadow-xl overflow-auto"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between border-b border-border p-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-dark/80">Request Tool / Machine</h2>
              <p className="text-sm text-primary/70">Submit a request for available equipment.</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="text-primary/60 hover:text-secondary-dark hover:scale-110 transition-colors"
            >
              <FaXmark className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs text-primary-dark font-semibold tracking-wide">Equipment</label>
              <select
                className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark"
                {...register("equipment_id")}
              >
                <option value="" disabled>
                  {isLoading ? "Loading equipment..." : "Select equipment"}
                </option>
                {availableEquipment.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.serial_number})
                  </option>
                ))}
              </select>
              {errors.equipment_id ? (
                <p className="text-xs text-secondary-light mt-1">{errors.equipment_id.message}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-primary-dark font-semibold tracking-wide">Date Needed</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark"
                  {...register("date_needed")}
                />
                {errors.date_needed ? (
                  <p className="text-xs text-secondary-light mt-1">{errors.date_needed.message}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label className="text-xs text-primary-dark font-semibold tracking-wide">Reason</label>
              <textarea
                rows={4}
                className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark"
                placeholder="Why is this equipment needed?"
                {...register("reason")}
              />
              {errors.reason ? (
                <p className="text-xs text-secondary-light mt-1">{errors.reason.message}</p>
              ) : null}
            </div>

            {createRequest.error ? (
              <p className="text-xs text-secondary-light">{extractApiError(createRequest.error)}</p>
            ) : null}
          </div>

          <div className="p-6 pt-0 flex items-center justify-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || createRequest.isPending}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary text-tetiary text-sm font-medium disabled:opacity-70"
            >
              {createRequest.isPending ? "Submitting..." : "Submit Request"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-border text-primary-dark text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
