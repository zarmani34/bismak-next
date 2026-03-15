"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaBuilding, FaClipboardList, FaUserTie } from "react-icons/fa6";
import { useCreateAssignment, useDeleteAssignment } from "@/hooks/useAssignment";
import { useStaffList } from "@/hooks/useStaff";
import { extractApiError } from "@/lib/errors";
import { CreateAssignmentData, CreateAssignmentSchema } from "@/schemas/assignment";



type ProjectAssignmentsCardProps = {
  assignments?: any[];
  company: string;
  projectCode: string;
};

export default function ProjectAssignmentsCard({
  assignments,
  company,
  projectCode,
}: ProjectAssignmentsCardProps) {
  const createAssignment = useCreateAssignment(projectCode);
  const deleteAssignment = useDeleteAssignment(projectCode);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const { data: staffList, isLoading: isStaffLoading, error: staffError } = useStaffList();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateAssignmentData>({
    resolver: zodResolver(CreateAssignmentSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: CreateAssignmentData) => {
    await createAssignment.mutateAsync(data);
    reset();
  };

  const handleUnassign = async () => {
    if (!confirmingId || deleteAssignment.isPending) return;
    try {
      await deleteAssignment.mutateAsync(confirmingId);
      setConfirmingId(null);
    } catch {
      // handled by React Query
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-primary-light/20 p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-primary-dark">Assigned staffs</h2>
        {assignments?.length ? (
          <span className="text-xs text-secondary-text">{assignments.length} items</span>
        ) : null}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-border bg-tetiary/80 p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-secondary-text">Assign to</label>
            <select
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
              defaultValue=""
              disabled={isStaffLoading || !!staffError}
              {...register("assignee_id")}
            >
              <option value="" disabled>
                {isStaffLoading
                  ? "Loading staff..."
                  : staffError
                  ? "Unable to load staff"
                  : "Select staff"}
              </option>
              {staffList?.map((staff) => (
                <option key={staff.user_id} value={staff.user_id}>
                  {staff.full_name} · {staff.email}
                </option>
              ))}
            </select>
            {errors.assignee_id && (
              <p className="text-xs text-secondary-light mt-1">{errors.assignee_id.message}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-secondary-text">Assignment role</label>
            <input
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
              placeholder="e.g. Tank pressure test"
              {...register("assignment_role")}
            />
            {errors.assignment_role && (
              <p className="text-xs text-secondary-light mt-1">
                {errors.assignment_role.message}
              </p>
            )}
          </div>
        </div>

        {createAssignment.error && (
          <p className="text-xs text-secondary-light mt-2">
            {extractApiError(createAssignment.error)}
          </p>
        )}

        <div className="mt-3 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting || createAssignment.isPending}
            className="px-4 py-2 rounded-xl bg-secondary text-tetiary text-sm font-medium hover:bg-secondary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {createAssignment.isPending ? "Assigning..." : "Assign"}
          </button>
        </div>
      </form>

      {assignments?.length ? (
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {assignments.map((assignment: any) => (
            <div key={assignment.id} className="rounded-xl border border-border bg-tetiary/80 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-secondary-text">Assignment</span>
                <button
                  type="button"
                  onClick={() => setConfirmingId(assignment.id)}
                  className="text-xs px-3 py-1 rounded-full border border-secondary/50 text-secondary hover:bg-secondary/10 transition-colors font-semibold"
                >
                  Unassign
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-secondary-text">
                    <FaUserTie className="w-4 h-4" />
                    Assigned to
                  </div>
                  <p className="mt-2 text-sm font-semibold text-primary-dark">
                    {assignment.assignee?.full_name || "Unassigned"}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-secondary-text">
                    <FaClipboardList className="w-4 h-4" />
                    Role
                  </div>
                  <p className="mt-2 text-sm font-medium text-primary-dark">
                    {assignment.assignment_role || "--"}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-secondary-text">
                    <FaBuilding className="w-4 h-4" />
                    Company
                  </div>
                  <p className="mt-2 text-sm font-medium text-primary-dark">
                    {assignment.company || company}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-secondary-text">
                    <FaUserTie className="w-4 h-4" />
                    Assigned By
                  </div>
                  <p className="mt-2 text-xs text-primary-dark">
                    {assignment.assigned_by || "--"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-secondary-text">No assignments yet.</p>
      )}

      {confirmingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/40 backdrop-blur-[1px] p-4">
          <div className="w-full max-w-sm rounded-2xl border border-primary-light bg-tetiary/95 shadow-xl p-5">
            <h3 className="text-lg font-semibold text-primary-dark">Unassign staff?</h3>
            <p className="text-sm text-secondary-text mt-2">
              This will remove the staff from this project.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmingId(null)}
                className="px-4 py-2 rounded-xl border border-border text-primary-dark hover:bg-primary-light/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUnassign}
                className="px-4 py-2 rounded-xl bg-secondary text-tetiary hover:bg-secondary-dark transition-colors"
              >
                Unassign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
