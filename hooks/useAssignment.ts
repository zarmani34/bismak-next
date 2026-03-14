import api from "@/lib/axios";
import { Assignment, CreateAssignmentData } from "@/schemas/assignment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "./useProjects";
import { eventKeys } from "./useEvent";

export const assignmentKeys = {
  all: (projectCode: string) => ["projects", projectCode, "assignments"] as const,
};
 
export function useAssignments(projectCode: string) {
  return useQuery<Assignment[]>({
    queryKey: assignmentKeys.all(projectCode),
    queryFn: async () => {
      const { data } = await api.get(`/projects/${projectCode}/assignments/`);
      return data;
    },
    enabled: !!projectCode,
  });
}
 
export function useCreateAssignment(projectCode: string) {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: async (assignmentData: CreateAssignmentData) => {
      const { data } = await api.post(
        `/projects/${projectCode}/assignments/`,
        assignmentData
      );
      return data as Assignment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectCode) });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all(projectCode) });
      queryClient.invalidateQueries({ queryKey: eventKeys.all(projectCode) });
    },
  });
}
 
export function useDeleteAssignment(projectCode: string) {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: async (assignmentId: string) => {
      await api.delete(`/projects/${projectCode}/assignments/${assignmentId}/`);
      return assignmentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectCode) });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all(projectCode) });
      queryClient.invalidateQueries({ queryKey: eventKeys.all(projectCode) });
    },
  });
}