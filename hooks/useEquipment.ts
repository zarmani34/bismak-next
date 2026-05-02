import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  EquipmentListItem,
  EquipmentDetail,
  CreateEquipmentData,
  UpdateEquipmentData,
  EquipmentRequestListItem,
  EquipmentRequestDetail,
  CreateEquipmentRequestData,
  MaintenanceRequestListItem,
  MaintenanceRequestDetail,
  CreateMaintenanceRequestData,
  EquipmentCategoryListItem,
} from "@/schemas/equipment";

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const normalizeListResponse = <T>(data: unknown): T[] => {
  if (Array.isArray(data)) return data as T[];

  if (
    typeof data === "object" &&
    data !== null &&
    "results" in data &&
    Array.isArray((data as PaginatedResponse<T>).results)
  ) {
    return (data as PaginatedResponse<T>).results;
  }

  return [];
};

// ---- Query Keys ----

export const equipmentKeys = {
  all: ["equipment"] as const,
  list: (filters?: Record<string, string>) =>
    [...equipmentKeys.all, "list", filters] as const,
  detail: (id: string) => [...equipmentKeys.all, "detail", id] as const,

  // nested under equipment
  requests: (equipmentId: string) =>
    [...equipmentKeys.detail(equipmentId), "requests"] as const,
  maintenance: (equipmentId: string) =>
    [...equipmentKeys.detail(equipmentId), "maintenance"] as const,
};

export const equipmentRequestKeys = {
  all: ["equipment-requests"] as const,
  detail: (id: string) => ["equipment-requests", id] as const,
};

export const maintenanceRequestKeys = {
  all: ["maintenance-requests"] as const,
  detail: (id: string) => ["maintenance-requests", id] as const,
};

export const equipmentCategoryKeys = {
  all: ["equipment-categories"] as const,
  list: () => [...equipmentCategoryKeys.all, "list"] as const,
};

// ---- Equipment Hooks ----

export function useEquipmentList(filters?: Record<string, string>) {
  return useQuery<EquipmentListItem[]>({
    queryKey: equipmentKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get("/equipment/", { params: filters });
      return normalizeListResponse<EquipmentListItem>(data);
    },
  });
}

export function useEquipment(id: string) {
  return useQuery<EquipmentDetail>({
    queryKey: equipmentKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/equipment/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (equipmentData: CreateEquipmentData) => {
      const { data } = await api.post("/equipment/", equipmentData);
      console.log("Equipment data:", data)
      return data as EquipmentDetail;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
    },
  });
}

export function useUpdateEquipment(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (equipmentData: UpdateEquipmentData) => {
      const { data } = await api.patch(`/equipment/${id}/`, equipmentData);
      return data as EquipmentDetail;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(equipmentKeys.detail(id), updated);
      queryClient.invalidateQueries({ queryKey: equipmentKeys.list() });
    },
  });
}

// ---- Equipment Request Hooks ----

/**
 * All equipment requests — standalone endpoint
 */
export function useEquipmentRequests(filters?: Record<string, string>) {
  return useQuery<EquipmentRequestListItem[]>({
    queryKey: equipmentRequestKeys.all,
    queryFn: async () => {
      const { data } = await api.get("/equipment-requests/", { params: filters });
      return normalizeListResponse<EquipmentRequestListItem>(data);
    },
  });
}

/**
 * Equipment requests nested under a specific equipment
 */
export function useEquipmentItemRequests(equipmentId: string) {
  return useQuery<EquipmentRequestListItem[]>({
    queryKey: equipmentKeys.requests(equipmentId),
    queryFn: async () => {
      const { data } = await api.get(`/equipment/${equipmentId}/requests/`);
      return normalizeListResponse<EquipmentRequestListItem>(data);
    },
    enabled: !!equipmentId,
  });
}

export function useEquipmentRequest(id: string) {
  return useQuery<EquipmentRequestDetail>({
    queryKey: equipmentRequestKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/equipment-requests/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateEquipmentRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestData: CreateEquipmentRequestData) => {
      const { data } = await api.post("/equipment-requests/", requestData);
      return data as EquipmentRequestDetail;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentRequestKeys.all });
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
    },
  });
}

// ---- Maintenance Request Hooks ----

/**
 * All maintenance requests — standalone endpoint
 */
export function useMaintenanceRequests(filters?: Record<string, string>) {
  return useQuery<MaintenanceRequestListItem[]>({
    queryKey: maintenanceRequestKeys.all,
    queryFn: async () => {
      const { data } = await api.get("/maintenance-requests/", { params: filters });
      return normalizeListResponse<MaintenanceRequestListItem>(data);
    },
  });
}

/**
 * Maintenance requests nested under a specific equipment
 */
export function useEquipmentMaintenanceRequests(equipmentId: string) {
  return useQuery<MaintenanceRequestListItem[]>({
    queryKey: equipmentKeys.maintenance(equipmentId),
    queryFn: async () => {
      const { data } = await api.get(`/equipment/${equipmentId}/maintenance/`);
      return normalizeListResponse<MaintenanceRequestListItem>(data);
    },
    enabled: !!equipmentId,
  });
}

export function useMaintenanceRequest(id: string) {
  return useQuery<MaintenanceRequestDetail>({
    queryKey: maintenanceRequestKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/maintenance-requests/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateMaintenanceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestData: CreateMaintenanceRequestData) => {
      const { data } = await api.post("/maintenance-requests/", requestData);
      return data as MaintenanceRequestDetail;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenanceRequestKeys.all });
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
    },
  });
}


// Create equipment category hooks for listing the equipment category and creating equipment category

export function useEquipmentCategories(options?: { enabled?: boolean }) {
  return useQuery<EquipmentCategoryListItem[]>({
    queryKey: equipmentCategoryKeys.list(),
    queryFn: async () => {
      const { data } = await api.get("/equipment-categories/");
      return normalizeListResponse<EquipmentCategoryListItem>(data);
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
}