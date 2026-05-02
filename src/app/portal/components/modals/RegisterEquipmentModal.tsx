"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaXmark } from "react-icons/fa6";
import {
  useCreateEquipment,
  useEquipmentCategories,
} from "@/hooks/useEquipment";
import { extractApiError } from "@/lib/errors";
import { useState } from "react";
import { CreateEquipmentData, CreateEquipmentSchema } from "@/schemas/equipment";


type RegisterEquipmentModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function RegisterEquipmentModal({
  open,
  onClose,
}: RegisterEquipmentModalProps) {
  const createEquipment = useCreateEquipment();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useEquipmentCategories({enabled: open});

  const requireCustomCategory =
    selectedCategory === "custom" ||
    isCategoriesError ||
    (isCategoriesLoading && !categories.length);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateEquipmentData>({
    resolver: zodResolver(CreateEquipmentSchema),
    defaultValues: {
      name: "",
      category_id: "",
      custom_category: "",
      serial_number: "",
      model: "",
      description: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);

    if (value === "custom") {
      setValue("category_id", null, { shouldValidate: true });
      return;
    }

    setValue("category_id", value, { shouldValidate: true });
  };

  const onSubmit = async (data: CreateEquipmentData) => {
    await createEquipment.mutateAsync({
      name: data.name,
      category_id: data.category_id,
      serial_number: data.serial_number,
      model: data.model,
      description: data.description?.trim() ? data.description.trim() : null,
      custom_category: data.custom_category?.trim() ? data.custom_category.trim() : null,
    });

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
              <h2 className="text-2xl font-bold text-primary-dark/80">
                Register Tool / Machine
              </h2>
              <p className="text-sm text-primary/70">
                Add a new equipment item to the register.
              </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-primary-dark font-semibold tracking-wide">
                  Name
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark"
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
                  Category
                </label>
                <select
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  disabled={isCategoriesLoading}
                >
                  <option value="" disabled>
                    {isCategoriesLoading
                      ? "Loading categories..."
                      : "Select a category"}
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}

                  <option value="custom">Custom Category</option>
                </select>
                {errors.category_id ? (
                  <p className="text-xs text-secondary-light mt-1">
                    {errors.category_id.message}
                  </p>
                ) : null}
              </div>
              
              {requireCustomCategory && (
                <div>
                  <label className="text-xs text-primary-dark font-semibold tracking-wide">
                    Custom Category
                  </label>
                  <input
                    className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark"
                    {...register("custom_category")}
                  />
                  {errors.custom_category ? (
                    <p className="text-xs text-secondary-light mt-1">
                      {errors.custom_category.message}
                    </p>
                  ) : null}
                </div>
              )}
              

              <div>
                <label className="text-xs text-primary-dark font-semibold tracking-wide">
                  Serial Number
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark"
                  {...register("serial_number")}
                />
                {errors.serial_number ? (
                  <p className="text-xs text-secondary-light mt-1">
                    {errors.serial_number.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="text-xs text-primary-dark font-semibold tracking-wide">
                  Model
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark"
                  {...register("model")}
                />
                {errors.model ? (
                  <p className="text-xs text-secondary-light mt-1">
                    {errors.model.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <label className="text-xs text-primary-dark font-semibold tracking-wide">
                Description
              </label>
              <textarea
                rows={4}
                className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark"
                {...register("description")}
              />
            </div>

            {createEquipment.error ? (
              <p className="text-xs text-secondary-light">
                {extractApiError(createEquipment.error)}
              </p>
            ) : null}
          </div>

          <div className="p-6 pt-0 flex items-center justify-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || createEquipment.isPending}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary text-tetiary text-sm font-medium disabled:opacity-70"
            >
              {createEquipment.isPending ? "Saving..." : "Save Equipment"}
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
