import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useDebounce } from "./useDebounce";

export function usePermitLookup(client: string) {
  const debounced = useDebounce(client, 400);
  return useQuery({
    queryKey: ["permit-lookup", debounced],
    queryFn: async () => {
      const { data } = await api.get(`/safety-valve-certificates/latest/`, { params: { client: debounced } });
      return data?.[0] ?? null;
    },
    enabled: debounced.trim().length > 1,
  });
}