import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useDebounce } from "./useDebounce";

export function useTankLookup(param: "serial_no" | "truck_no", value: string) {
  const debounced = useDebounce(value, 400);
  return useQuery({
    queryKey: ["tank-lookup", param, debounced],
    queryFn: async () => {
      const { data } = await api.get(`/pressure-tests/tank-lookup/`, { params: { [param]: debounced } });
      return data?.[0] ?? null;
    },
    enabled: debounced.trim().length > 1,
  });
}

