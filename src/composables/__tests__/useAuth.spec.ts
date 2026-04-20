import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuth } from '../useAuth'
import apiClient from '../../api/client'

vi.mock('../../api/client', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

const mockedPost = vi.mocked(apiClient.post)
const mockedGet = vi.mocked(apiClient.get)

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    const { logout } = useAuth()
    logout()
  })

  it('sets user and stores token on successful login', async () => {
    const mockResponse = {
      data: {
        user: { id: '1', name: 'Michał', email: 'Michał@test.com', role: 'contractor' as const },
        token: 'test-token-123',
      },
    }
    mockedPost.mockResolvedValueOnce(mockResponse)

    const { login, user } = useAuth()
    await login('Michał@test.com', 'password')

    expect(mockedPost).toHaveBeenCalledWith('/login', {
      email: 'Michał@test.com',
      password: 'password',
    })
    expect(user.value).toEqual(mockResponse.data.user)
    expect(localStorage.getItem('auth_token')).toBe('test-token-123')
  })

  it('throws error on invalid credentials', async () => {
    mockedPost.mockRejectedValueOnce(new Error('Request failed with status code 401'))

    const { login } = useAuth()
    await expect(login('bad@test.com', 'wrong')).rejects.toThrow(
      'Request failed with status code 401',
    )
  })

  it('clears user and token on logout', async () => {
    const mockResponse = {
      data: {
        user: { id: '1', name: 'Michał', email: 'Michał@test.com', role: 'contractor' as const },
        token: 'test-token-123',
      },
    }
    mockedPost.mockResolvedValueOnce(mockResponse)

    const { login, logout, user } = useAuth()
    await login('Michał@test.com', 'password')

    logout()

    expect(user.value).toBeNull()
    expect(localStorage.getItem('auth_token')).toBeNull()
  })

  it('isAuthenticated is true when user is set', async () => {
    const mockResponse = {
      data: {
        user: { id: '1', name: 'Michał', email: 'Michał@test.com', role: 'contractor' as const },
        token: 'test-token-123',
      },
    }
    mockedPost.mockResolvedValueOnce(mockResponse)

    const { login, isAuthenticated } = useAuth()
    await login('Michał@test.com', 'password')

    expect(isAuthenticated.value).toBe(true)
  })

  it('isAuthenticated is false when user is null', () => {
    const { isAuthenticated } = useAuth()
    expect(isAuthenticated.value).toBe(false)
  })

  it('fetchCurrentUser sets user from /me endpoint', async () => {
    mockedGet.mockResolvedValueOnce({
      data: { id: '1', name: 'Nick', email: 'Nick@test.com', role: 'owner' as const },
    })

    const { fetchCurrentUser, user } = useAuth()
    await fetchCurrentUser()

    expect(mockedGet).toHaveBeenCalledWith('/me')
    expect(user.value).toEqual({
      id: '1',
      name: 'Nick',
      email: 'Nick@test.com',
      role: 'owner',
    })
  })
})
