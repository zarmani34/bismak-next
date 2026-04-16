import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  CreateServiceRequestData,
  ServiceStats,
  ServiceType,
} from "@/schemas/services";


export const serviceKeys = {
  all: ["services"] as const,
  list: (filters?: Record<string, string>) =>
    [...serviceKeys.all, "list", filters] as const,
  detail: (code: string) => [...serviceKeys.all, "detail", code] as const,
};

export function useServiceRequests(filters?: Record<string, string>) {
  return useQuery({
    queryKey: serviceKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get("/services/", { params: filters });
      return data;
    },
  });
}

export function useCreateServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceData: CreateServiceRequestData) => {
      const { data } = await api.post("/services/", serviceData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.list() });
      queryClient.invalidateQueries({ queryKey: [...serviceKeys.all, "stats"] });
    },
  });
}

export function useServiceStats() {
  return useQuery<ServiceStats>({
    queryKey: [...serviceKeys.all, "stats"],
    queryFn: async () => {
      const { data } = await api.get("/services/stats/");
      return data;
    },
  });
}

export function useServiceTypes() {
  return useQuery<ServiceType[]>({
    queryKey:  [...serviceKeys.all, "types"],
    queryFn: async () => {
      const { data } = await api.get("/service-types/");
      console.log("Fetched service types:", data);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
