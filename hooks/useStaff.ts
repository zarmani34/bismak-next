import api from "@/lib/axios";
import { User } from "@/schemas/user";
import { useQuery } from "@tanstack/react-query";

export const staffListKey = ["staffList"];
export function useStaffList() {
  return useQuery<User[]>({
    queryKey: staffListKey,
    queryFn: async () => {
      const { data } = await api.get("/auth/users/staffs/");
      return data;
    },
    staleTime: Infinity,
  });
}