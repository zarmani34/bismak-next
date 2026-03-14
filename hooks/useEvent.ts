import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { CreateEventData } from "@/schemas/event";
import { projectKeys } from "./useProjects";


export const eventKeys = {
  all: (projectCode: string) => ["projects", projectCode, "events"] as const,
  detail: (projectCode: string, eventId: string) =>
    ["projects", projectCode, "events", eventId] as const,
};

// ---- Hooks ----

export function useEvents(projectCode: string) {
  return useQuery<Event[]>({
    queryKey: eventKeys.all(projectCode),
    queryFn: async () => {
      const { data } = await api.get(`/projects/${projectCode}/events/`);
      return data;
    },
    enabled: !!projectCode,
  });
}

export function useCreateEvent(projectCode: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData: CreateEventData) => {
      const { data } = await api.post(
        `/projects/${projectCode}/events/`,
        eventData
      );
      return data as Event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all(projectCode) });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectCode) });
    },
  });
}

export function useDeleteEvent(projectCode: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      await api.delete(`/projects/${projectCode}/events/${eventId}/`);
      return eventId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all(projectCode) });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectCode) });},
  });
}