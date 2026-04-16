"use client";

import { ServiceType } from "@/schemas/services";

type ServiceTypesPanelProps = {
  serviceTypes: ServiceType[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

const isActiveServiceType = (value: ServiceType["is_active"]) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  const normalized = value.toLowerCase().trim();
  return ["true", "1", "yes", "active"].includes(normalized);
};

export default function ServiceTypesPanel({
  serviceTypes,
  isLoading,
  isError,
  onRetry,
}: ServiceTypesPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-primary-light/20 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-primary-light/40 flex items-center justify-between">
        <h2 className="text-base font-semibold text-primary-dark">Service Types</h2>
        <span className="text-xs text-secondary-text">{serviceTypes.length}</span>
      </div>

      {isLoading ? (
        <div className="px-6 py-8 text-sm text-secondary-text">
          Loading service types...
        </div>
      ) : isError ? (
        <div className="px-6 py-8">
          <p className="text-sm text-secondary-text">
            Unable to load service types.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 inline-flex items-center justify-center rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary-light/30"
          >
            Retry
          </button>
        </div>
      ) : serviceTypes.length === 0 ? (
        <div className="px-6 py-8 text-sm text-secondary-text">
          No service types created yet.
        </div>
      ) : (
        <div className="max-h-72 overflow-y-auto p-4">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
            {serviceTypes.map((serviceType) => {
              const isActive = isActiveServiceType(serviceType.is_active);
              return (
                <div
                  key={String(serviceType.id)}
                  className="w-full rounded-lg border border-border bg-tetiary px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-primary-dark">
                        {serviceType.name}
                      </p>
                      <p className="text-xs text-secondary-text mt-1">
                        {serviceType.description || "No description"}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        isActive
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary/20 text-secondary"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
