import { ref, computed, type Ref, type ComputedRef } from 'vue'
import apiClient from '../api/client'
import type { User, LoginResponse } from '../types'

const user: Ref<User | null> = ref(null)
const token: Ref<string | null> = ref(localStorage.getItem('auth_token'))

interface UseAuth {
  user: Ref<User | null>
  isAuthenticated: ComputedRef<boolean>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  fetchCurrentUser: () => Promise<void>
}

export function useAuth(): UseAuth {
  const isAuthenticated = computed((): boolean => user.value !== null)

  async function login(email: string, password: string): Promise<void> {
    const response = await apiClient.post<LoginResponse>('/login', { email, password })
    token.value = response.data.token
    user.value = response.data.user
    localStorage.setItem('auth_token', response.data.token)
  }

  function logout(): void {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }

  async function fetchCurrentUser(): Promise<void> {
    const response = await apiClient.get<{ data: User }>('/me')
    user.value = response.data.data
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    fetchCurrentUser,
  }
}
