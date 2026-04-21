import { ref, type Ref } from 'vue'
import apiClient from '../api/client'
import type {
  ChangeOrder,
  CreateChangeOrderPayload,
  TransitionPayload,
  AuditLog,
  ApiResponse,
} from '../types'

interface UseChangeOrders {
  changeOrders: Ref<ChangeOrder[]>
  currentChangeOrder: Ref<ChangeOrder | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchChangeOrders: (projectId: string) => Promise<void>
  fetchChangeOrder: (projectId: string, changeOrderId: string) => Promise<void>
  createChangeOrder: (projectId: string, payload: CreateChangeOrderPayload) => Promise<ChangeOrder>
  updateChangeOrder: (projectId: string, changeOrderId: string, payload: Partial<CreateChangeOrderPayload>) => Promise<ChangeOrder>
  transitionChangeOrder: (projectId: string, changeOrderId: string, payload: TransitionPayload) => Promise<ChangeOrder>
  fetchAuditLogs: (projectId: string, changeOrderId: string) => Promise<AuditLog[]>
}

export function useChangeOrders(): UseChangeOrders {
  const changeOrders: Ref<ChangeOrder[]> = ref([])
  const currentChangeOrder: Ref<ChangeOrder | null> = ref(null)
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  async function fetchChangeOrders(projectId: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get<ApiResponse<ChangeOrder[]>>(
        `/projects/${projectId}/change-orders`,
      )
      changeOrders.value = response.data.data
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to fetch change orders'
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchChangeOrder(projectId: string, changeOrderId: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get<ApiResponse<ChangeOrder>>(
        `/projects/${projectId}/change-orders/${changeOrderId}`,
      )
      currentChangeOrder.value = response.data.data
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to fetch change order'
      }
    } finally {
      loading.value = false
    }
  }

  async function createChangeOrder(
    projectId: string,
    payload: CreateChangeOrderPayload,
  ): Promise<ChangeOrder> {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.post<ApiResponse<ChangeOrder>>(
        `/projects/${projectId}/change-orders`,
        payload,
      )
      return response.data.data
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to create change order'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateChangeOrder(
    projectId: string,
    changeOrderId: string,
    payload: Partial<CreateChangeOrderPayload>,
  ): Promise<ChangeOrder> {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.patch<ApiResponse<ChangeOrder>>(
        `/projects/${projectId}/change-orders/${changeOrderId}`,
        payload,
      )
      return response.data.data
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to update change order'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function transitionChangeOrder(
    projectId: string,
    changeOrderId: string,
    payload: TransitionPayload,
  ): Promise<ChangeOrder> {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.patch<ApiResponse<ChangeOrder>>(
        `/projects/${projectId}/change-orders/${changeOrderId}/transition`,
        payload,
      )
      return response.data.data
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to transition change order'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchAuditLogs(
    projectId: string,
    changeOrderId: string,
  ): Promise<AuditLog[]> {
    const response = await apiClient.get<ApiResponse<AuditLog[]>>(
      `/projects/${projectId}/change-orders/${changeOrderId}/audit-logs`,
    )
    return response.data.data
  }

  return {
    changeOrders,
    currentChangeOrder,
    loading,
    error,
    fetchChangeOrders,
    fetchChangeOrder,
    createChangeOrder,
    updateChangeOrder,
    transitionChangeOrder,
    fetchAuditLogs,
  }
}
