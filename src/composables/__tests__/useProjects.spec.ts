import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useProjects } from '../useProjects'
import apiClient from '../../api/client'
import type { Project } from '../../types'

vi.mock('../../api/client', () => ({
  default: {
    get: vi.fn(),
  },
}))

const mockedGet = vi.mocked(apiClient.get)

const mockProject: Project = {
  id: 'proj-1',
  name: 'Downtown Tower',
  description: 'A high-rise construction project',
  original_budget: 25000000,
  approved_changes_total: 150000,
  current_budget: 25150000,
  change_orders_count: 5,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

describe('useProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchProjects sets projects ref on success', async () => {
    mockedGet.mockResolvedValueOnce({ data: { data: [mockProject] } })

    const { fetchProjects, projects } = useProjects()
    await fetchProjects()

    expect(mockedGet).toHaveBeenCalledWith('/projects')
    expect(projects.value).toEqual([mockProject])
  })

  it('fetchProject sets currentProject ref on success', async () => {
    const fullProject = { ...mockProject, budget_line_items: [] }
    mockedGet.mockResolvedValueOnce({ data: { data: fullProject } })

    const { fetchProject, currentProject } = useProjects()
    await fetchProject('proj-1')

    expect(mockedGet).toHaveBeenCalledWith('/projects/proj-1')
    expect(currentProject.value).toEqual(fullProject)
  })

  it('sets error when fetchProjects API call fails', async () => {
    mockedGet.mockRejectedValueOnce(new Error('Server error'))

    const { fetchProjects, error } = useProjects()
    await fetchProjects()

    expect(error.value).toBe('Server error')
  })

  it('sets error when fetchProject API call fails', async () => {
    mockedGet.mockRejectedValueOnce(new Error('Not found'))

    const { fetchProject, error } = useProjects()
    await fetchProject('bad-id')

    expect(error.value).toBe('Not found')
  })
})
