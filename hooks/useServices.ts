import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { ServiceStats } from "@/schemas/services";


export const serviceKeys = {
  all: ["services"] as const,
  list: (filters?: Record<string, string>) =>
    [...serviceKeys.all, "list", filters] as const,
  detail: (code: string) => [...serviceKeys.all, "detail", code] as const,
};
export function useServiceStats() {
  return useQuery<ServiceStats>({
    queryKey: [...serviceKeys.all, "stats"],
    queryFn: async () => {
      const { data } = await api.get("/services/stats/");
      console.log("Fetched service stats:", data);
      return data;
    },
  });
}