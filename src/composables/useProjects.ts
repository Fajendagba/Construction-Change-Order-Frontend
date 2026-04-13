import { ref, type Ref } from 'vue'
import apiClient from '../api/client'
import type { Project, ApiResponse } from '../types'

interface UseProjects {
  projects: Ref<Project[]>
  currentProject: Ref<Project | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchProjects: () => Promise<void>
  fetchProject: (id: string) => Promise<void>
}

export function useProjects(): UseProjects {
  const projects: Ref<Project[]> = ref([])
  const currentProject: Ref<Project | null> = ref(null)
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  async function fetchProjects(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get<ApiResponse<Project[]>>('/projects')
      projects.value = response.data.data
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to fetch projects'
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchProject(id: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`)
      currentProject.value = response.data.data
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to fetch project'
      }
    } finally {
      loading.value = false
    }
  }

  return {
    projects,
    currentProject,
    loading,
    error,
    fetchProjects,
    fetchProject,
  }
}
