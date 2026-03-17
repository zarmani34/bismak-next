import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  LeakTest,
  CreateLeakTestData,
} from "@/schemas/leak_test";
import { projectKeys } from "@/hooks/useProjects";

// ---- Query Keys ----

export const testKeys = {
  leakTest: (projectCode: string) =>
    [...projectKeys.detail(projectCode), "leak-test"] as const,
};


export function useLeakTest(projectCode: string) {
  return useQuery<LeakTest>({
    queryKey: testKeys.leakTest(projectCode),
    queryFn: async () => {
      const { data } = await api.get(`/projects/${projectCode}/leak-test/`);
      return data;
    },
    enabled: !!projectCode,
  });
}

export function useCreateLeakTest(projectCode: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testData: CreateLeakTestData) => {
      const { data } = await api.post(
        `/projects/${projectCode}/leak-test/`,
        testData,
      );
      return data as LeakTest;
    },
    onSuccess: (data) => {
      // set in cache immediately
      queryClient.setQueryData(testKeys.leakTest(projectCode), data);
      // invalidate project detail so leak_test field updates
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(projectCode),
      });
    },
  });
}

export function useUpdateLeakTest(projectCode: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testData: Partial<CreateLeakTestData>) => {
      const { data } = await api.patch(
        `/projects/${projectCode}/leak-test/`,
        testData,
      );
      return data as LeakTest;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(testKeys.leakTest(projectCode), data);
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(projectCode),
      });
    },
  });
}