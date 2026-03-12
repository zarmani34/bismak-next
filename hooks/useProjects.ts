import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { CreateProjectData, UpdateProjectData, ProjectListItem, ProjectDetail } from "@/schemas/project";

export const projectKeys = {
  all: ["projects"] as const,
  list: (filters?: Record<string, string>) =>
    [...projectKeys.all, "list", filters] as const,
  detail: (code: string) => [...projectKeys.all, "detail", code] as const,
};

type ProjectStats = {
  total: number;
  planning: number;
  in_progress: number;
  on_hold: number;
  completed: number;
  cancelled: number;
};

type CreateProjectAssignmentData = {
  assignee_id: string;
  assignment_role: string;
};

type CreateTimelineEventData = {
  title: string;
  description: string;
};

type StatusUpdateResponse = {
  message: string;
  old_status: string;
  new_status: string;
  allowed_transitions: string[];
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

/**
 * FETCH PROJECTS LIST
 */
export function useProjects(filters?: Record<string, string>) {
  return useQuery<PaginatedResponse<ProjectListItem>>({
    queryKey: projectKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get("/projects/", { params: filters });
      return data;
    },
  });
}

/**
 * FETCH SINGLE PROJECT
 */
export function useProject(code: string) {
  return useQuery<ProjectDetail>({
    queryKey: projectKeys.detail(code),
    queryFn: async () => {
      const { data } = await api.get(`/projects/${code}/`);
      return data;
    },
    enabled: !!code, // only runs if code is provided
  });
}

/**
 * CREATE PROJECT
 * On success invalidates the projects list so it refetches fresh data
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData: CreateProjectData) => {
      const { data } = await api.post("/projects/", projectData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

/**
 * UPDATE PROJECT (PATCH — partial update)
 * On success updates the specific project in cache and refreshes list
 */
export function useUpdateProject(code: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData: UpdateProjectData) => {
      const { data } = await api.patch(`/projects/${code}/`, projectData);
      return data;
    },
    onSuccess: (updatedProject) => {
      // update the specific project detail in cache immediately
      queryClient.setQueryData(projectKeys.detail(code), updatedProject);
      // invalidate list so it refetches with updated data
      queryClient.invalidateQueries({ queryKey: projectKeys.list() });
    },
  });
}

/**
 * DELETE PROJECT
 * remove project from cache and refreshes list on success
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      await api.delete(`/projects/${code}/`);
      return code;
    },
    onSuccess: (code) => {
      // remove from detail cache
      queryClient.removeQueries({ queryKey: projectKeys.detail(code) });
      // invalidate list
      queryClient.invalidateQueries({ queryKey: projectKeys.list() });
    },
  });
}

/**
 * UPDATE PROJECT STATUS
 * On success refreshes detail + list to reflect new status
 */
export function useUpdateProjectStatus(code: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: string) => {
      const { data } = await api.patch(`/projects/${code}/update-status/`, { status });
      return data as StatusUpdateResponse;
    },
    onSuccess: (response) => {
      queryClient.setQueryData<ProjectDetail>(
        projectKeys.detail(code),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            status: response.new_status as ProjectDetail["status"],
            status_display: response.new_status
              .replace("_", " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()),
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(code) });
      queryClient.invalidateQueries({ queryKey: projectKeys.list() });
    },
  });
}

/**
 * CREATE PROJECT ASSIGNMENT
 * On success refreshes project details to show latest assignments
 */
export function useCreateProjectAssignment(code: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProjectAssignmentData) => {
      const { data } = await api.post(`/projects/${code}/assignments/`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(code) });
    },
  });
}

/**
 * CREATE PROJECT TIMELINE EVENT
 * On success refreshes project details to show latest events
 */
export function useCreateProjectEvent(code: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTimelineEventData) => {
      const { data } = await api.post(`/projects/${code}/events/`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(code) });
    },
  });
}

export function useProjectStats() {
  return useQuery<ProjectStats>({
    queryKey: [...projectKeys.all, "stats"],
    queryFn: async () => {
      const { data } = await api.get("/projects/stats/");
      return data;
    },
  });
}
