"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import SecondaryButton from "@/src/components/buttons/SecondaryButton";
import { FaXmark } from "react-icons/fa6";
import { CreateProjectData, CreateProjectSchema } from "@/schemas/project";
import { useCreateProject } from "@/hooks/useProjects";

type CreateProjectModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const createProject = useCreateProject();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateProjectData>({
    resolver: zodResolver(CreateProjectSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: CreateProjectData) => {
    await createProject.mutateAsync(data);
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-primary-dark/40 backdrop-blur-[1px] z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-3/4 rounded-2xl border border-primary-light bg-primary/95 shadow-xl overflow-auto"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between border-b border-border p-6">
            <div>
              <h2 className="text-2xl font-bold text-tetiary/80">Create Project</h2>
              <p className="text-sm text-tetiary/60">
                Fill in the details below to create a new project.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-tetiary/60 hover:text-secondary-dark transition-colors"
            >
              <FaXmark className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-tetiary/60">Project Name</label>
                <input
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-tetiary/75 text-primary-dark"
                  placeholder="e.g. Pipeline Integrity Audit"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-secondary-light mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-tetiary/60">Company</label>
                <input
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-tetiary/75 text-primary-dark"
                  placeholder="Client company"
                  {...register("company")}
                />
                {errors.company && (
                  <p className="text-xs text-secondary-light mt-1">{errors.company.message}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-tetiary/60">Location</label>
                <input
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-tetiary/75 text-primary-dark"
                  placeholder="Lagos"
                  {...register("location")}
                />
                {errors.location && (
                  <p className="text-xs text-secondary-light mt-1">{errors.location.message}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-tetiary/60">Client User ID</label>
                <input
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-tetiary/75 text-primary-dark"
                  placeholder="e.g. BE-CL-0001"
                  {...register("owner")}
                />
                {errors.owner && (
                  <p className="text-xs text-secondary-light mt-1">{errors.owner.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs text-tetiary/60">Description</label>
              <textarea
                rows={4}
                className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-tetiary/75 text-primary-dark"
                placeholder="Short project description"
                {...register("description")}
              />
            </div>

            {createProject.error && (
              <p className="text-xs text-secondary-light">
                {(createProject.error as any)?.response?.data?.error ||
                  (createProject.error as Error).message ||
                  "Unable to create project."}
              </p>
            )}
          </div>

          <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
            <button type="submit" className="flex-1" disabled={isSubmitting || createProject.isPending}>
              <PrimaryButton tittle={createProject.isPending ? "Saving..." : "Save Project"} />
            </button>
            <button type="button" className="flex-1" onClick={onClose}>
              <SecondaryButton tittle="Cancel" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
