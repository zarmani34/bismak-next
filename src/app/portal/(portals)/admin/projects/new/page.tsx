"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import PrimaryButton from "@/src/components/buttons/PrimaryButton";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/portal/admin/projects"
        className="inline-flex items-center gap-2 text-sm text-primary-dark hover:text-primary-light"
      >
        <FaArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      <div className="rounded-2xl border border-border bg-primary-light/20 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-primary-dark">Create Project</h1>
        <p className="text-secondary-text text-sm">
          Fill in the details below to register a new project.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white/70 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-secondary-text">Project Name</label>
            <input
              className="mt-1 w-full rounded-lg border border-border px-4 py-3 bg-primary-light/10 text-primary-dark"
              placeholder="e.g. Pipeline Integrity Audit"
            />
          </div>
          <div>
            <label className="text-xs text-secondary-text">Company</label>
            <input
              className="mt-1 w-full rounded-lg border border-border px-4 py-3 bg-primary-light/10 text-primary-dark"
              placeholder="Client company"
            />
          </div>
          <div>
            <label className="text-xs text-secondary-text">Location</label>
            <input
              className="mt-1 w-full rounded-lg border border-border px-4 py-3 bg-primary-light/10 text-primary-dark"
              placeholder="Lagos"
            />
          </div>
          <div>
            <label className="text-xs text-secondary-text">Due Date</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-border px-4 py-3 bg-primary-light/10 text-primary-dark"
            />
          </div>
          <div>
            <label className="text-xs text-secondary-text">Project Type</label>
            <input
              className="mt-1 w-full rounded-lg border border-border px-4 py-3 bg-primary-light/10 text-primary-dark"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="text-xs text-secondary-text">Status</label>
            <select className="mt-1 w-full rounded-lg border border-border px-4 py-3 bg-primary-light/10 text-primary-dark">
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs text-secondary-text">Description</label>
          <textarea
            rows={4}
            className="mt-1 w-full rounded-lg border border-border px-4 py-3 bg-primary-light/10 text-primary-dark"
            placeholder="Short project description"
          />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <PrimaryButton tittle="Save Project" />
          <button className="px-4 py-3 rounded-xl border border-border text-primary-dark hover:bg-primary-light/10 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
