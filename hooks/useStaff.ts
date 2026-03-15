import api from "@/lib/axios";
import { User } from "@/schemas/user";
import { useQuery } from "@tanstack/react-query";

export const staffListKey = ["staffList"];
type StaffListOptions = {
  enabled?: boolean;
};

export function useStaffList(options: StaffListOptions = {}) {
  const { enabled = true } = options;
  return useQuery<User[]>({
    queryKey: staffListKey,
    queryFn: async () => {
      const { data } = await api.get("/auth/users/staffs/");
      return data;
    },
    staleTime: Infinity,
    enabled,
  });
}
