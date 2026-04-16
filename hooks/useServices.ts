import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  CreateServiceRequestData,
  ServiceRequestDetail,
  CreateServiceTypeData,
  ServiceStats,
  ServiceType,
} from "@/schemas/services";


export const serviceKeys = {
  all: ["services"] as const,
  list: (filters?: Record<string, string>) =>
    [...serviceKeys.all, "list", filters] as const,
  detail: (code: string) => [...serviceKeys.all, "detail", code] as const,
  types: () => [...serviceKeys.all, "types"] as const,
};

export function useServiceRequests(filters?: Record<string, string>) {
  return useQuery({
    queryKey: serviceKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get("/services/", { params: filters });
      console.log("Fetched service requests:", data);
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

export function useServiceRequest(serviceCode: string) {
  return useQuery<ServiceRequestDetail>({
    queryKey: serviceKeys.detail(serviceCode),
    queryFn: async () => {
      const { data } = await api.get(`/services/${serviceCode}/`);
      return data;
    },
    enabled: !!serviceCode,
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

export function useServiceTypes(options?: { enabled?: boolean }) {
  return useQuery<ServiceType[]>({
    queryKey: serviceKeys.types(),
    queryFn: async () => {
      const { data } = await api.get("/service-types/");
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.results)) return data.results;
      return [];
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
}

export function useServiceType(id: number | string) {
  return useQuery<ServiceType>({
    queryKey: serviceKeys.detail(String(id)),
    queryFn: async () => {
      const { data } = await api.get(`/service-types/${id}/`);
      return data;
    } });
}

export function useCreateServiceType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceTypeData: CreateServiceTypeData) => {
      const payload = {
        ...serviceTypeData,
        description: serviceTypeData.description?.trim() || null,
      };
      const { data } = await api.post("/service-types/", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.types() });
    },
  });
}
