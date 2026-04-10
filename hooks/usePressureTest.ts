import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  PressureTest,
  CreatePressureTestData,
} from "@/schemas/pressure_test";
import { projectKeys } from "@/hooks/useProjects";

// ---- Query Keys ----

export const testKeys = {
      pressureTest: (projectCode: string) =>
    [...projectKeys.detail(projectCode), "pressure-test"] as const,
};

export type PressureTestResponse =
  | PressureTest
  | {
      results?: PressureTest[];
      count?: number;
      next?: string | null;
      previous?: string | null;
    }
  | PressureTest[]
  | null;

export function usePressureTest(projectCode: string) {
  return useQuery<PressureTestResponse>({
    queryKey: testKeys.pressureTest(projectCode),
    queryFn: async () => {
      const { data } = await api.get(`/projects/${projectCode}/pressure-test/`);
      return data as PressureTestResponse;
    },
    enabled: !!projectCode,
  });
}

export function useCreatePressureTest(projectCode: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testData: CreatePressureTestData) => {
      const { data } = await api.post(
        `/projects/${projectCode}/pressure-test/`,
        testData
      );
      return data as PressureTest;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(testKeys.pressureTest(projectCode), data);
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(projectCode),
      });
    },
  });
}

export function useUpdatePressureTest(projectCode: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testData: Partial<CreatePressureTestData>) => {
      const { data } = await api.patch(
        `/projects/${projectCode}/pressure-test/`,
        testData
      );
      return data as PressureTest;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(testKeys.pressureTest(projectCode), data);
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(projectCode),
      });
    },
  });
}
