import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { CreateStaffAdminData, UserListItem } from "@/schemas/users";

export const userKeys = {
  all: ["users"] as const,
  list: (filters?: Record<string, string>) =>
    [...userKeys.all, "list", filters] as const,
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

/**
 * FETCH USERS LIST
 * Admin sees all users, client sees only self (handled by Django get_queryset)
 * Pass filters like { role: "staff" } to filter the table by tab/column
 *
 * Django paginates by default — we unwrap `results` here so the rest of
 * the app just deals with a plain array.
 */
export function useUsers(filters?: Record<string, string>) {
  return useQuery<UserListItem[]>({
    queryKey: userKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<UserListItem>>(
        "/auth/users/",
        {
          params: filters,
        }
      );

      return data.results;
    },
  });
}

/**
 * CREATE STAFF OR ADMIN ACCOUNT
 * role field in the payload decides which endpoint to call
 */
export function useCreateStaffAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: CreateStaffAdminData) => {
      const endpoint =
        formData.role === "admin"
          ? "/auth/registration/admin/"
          : "/auth/registration/staff/";

      const { role, ...payload } = formData; // role not sent to Django, endpoint decides it
      const { data } = await api.post(endpoint, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}