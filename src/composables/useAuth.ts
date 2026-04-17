import { ref, computed, type Ref, type ComputedRef } from 'vue'
import apiClient from '../api/client'
import type { User, LoginResponse } from '../types'

function getUserFromStorage(): User | null {
  const stored = localStorage.getItem('auth_user')
  if (!stored) return null
  try {
    return JSON.parse(stored) as User
  } catch {
    return null
  }
}

const user: Ref<User | null> = ref(getUserFromStorage())
const token: Ref<string | null> = ref(localStorage.getItem('auth_token'))

interface UseAuth {
  user: Ref<User | null>
  token: Ref<string | null>
  isAuthenticated: ComputedRef<boolean>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  fetchCurrentUser: () => Promise<void>
}

export function useAuth(): UseAuth {
  const isAuthenticated = computed((): boolean => user.value !== null || token.value !== null)

  async function login(email: string, password: string): Promise<void> {
    const response = await apiClient.post<LoginResponse>('/login', { email, password })
    token.value = response.data.token
    user.value = response.data.user
    localStorage.setItem('auth_token', response.data.token)
    localStorage.setItem('auth_user', JSON.stringify(response.data.user))
  }

  function logout(): void {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  async function fetchCurrentUser(): Promise<void> {
    const response = await apiClient.get<User>('/me')
    user.value = response.data
    localStorage.setItem('auth_user', JSON.stringify(response.data))
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    fetchCurrentUser,
  }
}
