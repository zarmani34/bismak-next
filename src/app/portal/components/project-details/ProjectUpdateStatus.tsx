"use client";

import { useEffect, useState } from "react";

const STATUS_TRANSITIONS: Record<string, string[]> = {
  planning: ["in_progress", "cancelled"],
  in_progress: ["on_hold", "completed", "cancelled"],
  on_hold: ["in_progress", "cancelled"],
  completed: [],
  cancelled: [],
};

const formatStatusLabel = (status: string) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

type ProjectUpdateStatusProps = {
  currentStatus: string;
  onUpdate: (status: string) => Promise<void> | void;
  isPending?: boolean;
  errorMessage?: string;
};

export default function ProjectUpdateStatus({
  currentStatus,
  onUpdate,
  isPending = false,
  errorMessage,
}: ProjectUpdateStatusProps) {
  const [nextStatus, setNextStatus] = useState("");
  const allowedTransitions = STATUS_TRANSITIONS[currentStatus] ?? [];
  const transitionsKey = allowedTransitions.join("|");

  useEffect(() => {
    if (!allowedTransitions.length) {
      setNextStatus("");
      return;
    }
    if (!allowedTransitions.includes(nextStatus)) {
      setNextStatus(allowedTransitions[0]);
    }
  }, [currentStatus, transitionsKey, nextStatus]);

  const handleUpdate = async () => {
    if (!nextStatus || isPending) return;
    try {
      await onUpdate(nextStatus);
    } catch {
      // handled by React Query
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-primary-light/20 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-primary-dark">Update Status</h2>
          <p className="text-sm text-secondary-text">
            Current status: {formatStatusLabel(currentStatus)}
          </p>
        </div>
        {allowedTransitions.length ? (
          <span className="text-xs text-secondary-text">
            Allowed: {allowedTransitions.map(formatStatusLabel).join(", ")}
          </span>
        ) : (
          <span className="text-xs text-secondary-text">No further updates allowed.</span>
        )}
      </div>
      <div className="mt-4 space-y-3">
        <p className="text-xs text-secondary-text">Select next status</p>
        <div className="flex flex-wrap gap-2">
          {allowedTransitions.length ? (
            allowedTransitions.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setNextStatus(status)}
                disabled={isPending}
                className={`px-3 py-2 rounded-xl border text-sm transition-colors ${
                  nextStatus === status
                    ? "border-primary/60 bg-primary/10 text-primary-dark"
                    : "border-border bg-tetiary/80 text-secondary-text hover:text-primary-dark"
                }`}
              >
                {formatStatusLabel(status)}
              </button>
            ))
          ) : (
            <span className="text-xs text-secondary-text">No transitions available.</span>
          )}
        </div>
        <button
          className="px-4 py-2 rounded-xl bg-secondary text-tetiary hover:bg-secondary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleUpdate}
          disabled={!nextStatus || isPending || !allowedTransitions.length}
        >
          {isPending ? "Updating..." : "Update Status"}
        </button>
      </div>
      {errorMessage ? <p className="text-xs text-secondary-text mt-3">{errorMessage}</p> : null}
    </div>
  );
}
