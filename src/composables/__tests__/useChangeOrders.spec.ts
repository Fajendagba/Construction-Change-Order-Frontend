import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useChangeOrders } from '../useChangeOrders'
import apiClient from '../../api/client'
import type { ChangeOrder } from '../../types'

vi.mock('../../api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}))

const mockedGet = vi.mocked(apiClient.get)
const mockedPost = vi.mocked(apiClient.post)
const mockedPatch = vi.mocked(apiClient.patch)

const mockChangeOrder: ChangeOrder = {
  id: 'co-1',
  number: 1,
  title: 'Test Change Order',
  description: 'Test description',
  reason: 'Test reason',
  cost_code: '05-Metals',
  labor_cost: 10000,
  material_cost: 5000,
  total_cost: 15000,
  state: 'draft',
  submitted_by: null,
  reviewed_by: null,
  rejection_reason: null,
  state_changed_at: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

describe('useChangeOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchChangeOrders sets changeOrders ref on success', async () => {
    mockedGet.mockResolvedValueOnce({ data: { data: [mockChangeOrder] } })

    const { fetchChangeOrders, changeOrders } = useChangeOrders()
    await fetchChangeOrders('proj-1')

    expect(mockedGet).toHaveBeenCalledWith('/projects/proj-1/change-orders')
    expect(changeOrders.value).toEqual([mockChangeOrder])
  })

  it('fetchChangeOrders sets error ref on API failure', async () => {
    mockedGet.mockRejectedValueOnce(new Error('Network error'))

    const { fetchChangeOrders, error } = useChangeOrders()
    await fetchChangeOrders('proj-1')

    expect(error.value).toBe('Network error')
  })

  it('createChangeOrder returns the created change order', async () => {
    mockedPost.mockResolvedValueOnce({ data: { data: mockChangeOrder } })

    const { createChangeOrder } = useChangeOrders()
    const result = await createChangeOrder('proj-1', {
      title: 'Test Change Order',
      description: 'Test description',
      reason: 'Test reason',
      cost_code: '05-Metals',
      labor_cost: 10000,
      material_cost: 5000,
    })

    expect(result).toEqual(mockChangeOrder)
    expect(mockedPost).toHaveBeenCalledWith('/projects/proj-1/change-orders', {
      title: 'Test Change Order',
      description: 'Test description',
      reason: 'Test reason',
      cost_code: '05-Metals',
      labor_cost: 10000,
      material_cost: 5000,
    })
  })

  it('transitionChangeOrder calls correct endpoint with correct payload', async () => {
    const transitioned = { ...mockChangeOrder, state: 'submitted' as const }
    mockedPatch.mockResolvedValueOnce({ data: { data: transitioned } })

    const { transitionChangeOrder } = useChangeOrders()
    const result = await transitionChangeOrder('proj-1', 'co-1', {
      target_state: 'submitted',
    })

    expect(mockedPatch).toHaveBeenCalledWith(
      '/projects/proj-1/change-orders/co-1/transition',
      { target_state: 'submitted' },
    )
    expect(result.state).toBe('submitted')
  })

  it('loading is true during request and false after', async () => {
    let resolvePromise: (value: unknown) => void
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    mockedGet.mockReturnValueOnce(pendingPromise as ReturnType<typeof apiClient.get>)

    const { fetchChangeOrders, loading } = useChangeOrders()
    const fetchPromise = fetchChangeOrders('proj-1')

    expect(loading.value).toBe(true)

    resolvePromise!({ data: { data: [] } })
    await fetchPromise

    expect(loading.value).toBe(false)
  })
})
