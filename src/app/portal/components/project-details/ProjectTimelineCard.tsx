"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProjectEvent } from "@/hooks/useProjects";

const TimelineEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

type TimelineEventFormData = z.infer<typeof TimelineEventSchema>;

const formatDateTime = (value?: string | null) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

type ProjectTimelineCardProps = {
  events?: any[];
  projectCode: string;
};

export default function ProjectTimelineCard({ events, projectCode }: ProjectTimelineCardProps) {
  const createEvent = useCreateProjectEvent(projectCode);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TimelineEventFormData>({
    resolver: zodResolver(TimelineEventSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: TimelineEventFormData) => {
    await createEvent.mutateAsync(data);
    reset();
  };

  return (
    <div className="rounded-2xl border border-border bg-primary-light/20 p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-primary-dark">Timeline</h2>
        {events?.length ? (
          <span className="text-xs text-secondary-text">{events.length} events</span>
        ) : null}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-border bg-tetiary/80 p-4 mb-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-secondary-text">Title</label>
            <input
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
              placeholder="e.g. Status Updated"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-secondary-light mt-1">{errors.title.message}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-secondary-text">Description</label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
              placeholder="Short update description"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-secondary-light mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        {createEvent.error && (
          <p className="text-xs text-secondary-light mt-2">
            {(createEvent.error as any)?.response?.data?.error ||
              (createEvent.error as Error).message ||
              "Unable to add timeline event."}
          </p>
        )}

        <div className="mt-3 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting || createEvent.isPending}
            className="px-4 py-2 rounded-xl bg-secondary text-tetiary text-sm font-medium hover:bg-secondary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {createEvent.isPending ? "Saving..." : "Add Event"}
          </button>
        </div>
      </form>

      {events?.length ? (
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {events.map((event: any) => (
            <div key={event.id} className="rounded-xl border border-border bg-tetiary/80 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-primary-dark">{event.title}</p>
                <p className="text-xs text-secondary-text">
                  {formatDateTime(event.created_at)}
                </p>
              </div>
              <p className="text-xs text-secondary-text mt-1">{event.description}</p>
              <p className="text-xs text-secondary-text mt-1">
                By: {event.created_by?.full_name}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-secondary-text">No timeline events yet.</p>
      )}
    </div>
  );
}
