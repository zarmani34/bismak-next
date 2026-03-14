import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { User } from "@/schemas/user";

export const currentUserKey = ["currentUser"];

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: currentUserKey,
    queryFn: async () => {
      const { data } = await api.get("/auth/user/");
      return data;
    },
    staleTime: Infinity,
  });
}

