/**
 * Nuxt 3 specific API Client with enhanced features
 * Uses Nuxt composables and utilities for better integration
 */

import { getToken, isTokenExpired, removeToken } from './auth'
import { ApiError } from './apiTypes'

/**
 * Create headers with authentication and content type
 */
function createHeaders(customHeaders?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders
  }

  // Add authentication header if token exists and is valid
  const token = getToken()
  if (token && !isTokenExpired(token)) {
    headers['Authorization'] = `Bearer ${token}`
  } else if (token && isTokenExpired(token)) {
    // Remove expired token
    removeToken()
    console.warn('Expired token removed from storage')
  }

  return headers
}

/**
 * Handle API errors consistently
 */
function handleApiError(error: any, status?: number): never {
  if (error?.data) {
    const errorMessage = error.data?.message || error.data?.error || error.data?.statusMessage
    throw new ApiError(status || error.data?.statusCode || 500, 'API Error', {
      message: errorMessage,
      details: error.data
    })
  }
  
  throw new ApiError(status || 500, 'Unknown Error', {
    message: error?.message || 'An unknown error occurred'
  })
}

/**
 * Nuxt 3 GET request using $fetch
 */
export async function nuxtApiGet<T = any>(
  url: string,
  options: {
    query?: Record<string, any>
    headers?: Record<string, string>
    server?: boolean
  } = {}
): Promise<T> {
  try {
    const { $fetch } = useNuxtApp()
    
    return await $fetch<T>(url, {
      method: 'GET',
      headers: createHeaders(options.headers),
      query: options.query,
      server: options.server
    })
  } catch (error: any) {
    if (error?.statusCode === 401) {
      removeToken()
      await navigateTo('/login')
    }
    handleApiError(error, error?.statusCode)
  }
}

/**
 * Nuxt 3 POST request using $fetch
 */
export async function nuxtApiPost<T = any>(
  url: string,
  data: any,
  options: {
    headers?: Record<string, string>
    server?: boolean
  } = {}
): Promise<T> {
  try {
    const { $fetch } = useNuxtApp()
    
    return await $fetch<T>(url, {
      method: 'POST',
      headers: createHeaders(options.headers),
      body: data,
      server: options.server
    })
  } catch (error: any) {
    if (error?.statusCode === 401) {
      removeToken()
      await navigateTo('/login')
    }
    handleApiError(error, error?.statusCode)
  }
}

/**
 * Nuxt 3 PUT request using $fetch
 */
export async function nuxtApiPut<T = any>(
  url: string,
  data: any,
  options: {
    headers?: Record<string, string>
    server?: boolean
  } = {}
): Promise<T> {
  try {
    const { $fetch } = useNuxtApp()
    
    return await $fetch<T>(url, {
      method: 'PUT',
      headers: createHeaders(options.headers),
      body: data,
      server: options.server
    })
  } catch (error: any) {
    if (error?.statusCode === 401) {
      removeToken()
      await navigateTo('/login')
    }
    handleApiError(error, error?.statusCode)
  }
}

/**
 * Nuxt 3 DELETE request using $fetch
 */
export async function nuxtApiDelete<T = any>(
  url: string,
  options: {
    headers?: Record<string, string>
    server?: boolean
  } = {}
): Promise<T> {
  try {
    const { $fetch } = useNuxtApp()
    
    return await $fetch<T>(url, {
      method: 'DELETE',
      headers: createHeaders(options.headers),
      server: options.server
    })
  } catch (error: any) {
    if (error?.statusCode === 401) {
      removeToken()
      await navigateTo('/login')
    }
    handleApiError(error, error?.statusCode)
  }
}

/**
 * Nuxt 3 composable for reactive API calls
 */
export function useApiCall<T>(
  url: string | (() => string),
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: any
    query?: Record<string, any>
    headers?: Record<string, string>
    immediate?: boolean
    server?: boolean
    default?: () => T
    transform?: (data: any) => T
  } = {}
) {
  const {
    method = 'GET',
    body,
    query,
    headers,
    immediate = true,
    server = false,
    default: defaultFactory,
    transform
  } = options

  const data = ref<T | null>(defaultFactory ? defaultFactory() : null)
  const pending = ref(false)
  const error = ref<ApiError | null>(null)

  const execute = async () => {
    pending.value = true
    error.value = null

    try {
      const requestUrl = typeof url === 'function' ? url() : url
      const requestHeaders = createHeaders(headers)

      const response = await $fetch(requestUrl, {
        method,
        headers: requestHeaders,
        body: method !== 'GET' ? body : undefined,
        query: method === 'GET' ? query : undefined,
        server
      })

      data.value = transform ? transform(response) : response
    } catch (err: any) {
      if (err?.statusCode === 401) {
        removeToken()
        await navigateTo('/login')
      }
      
      error.value = new ApiError(
        err?.statusCode || 500,
        err?.statusMessage || 'API Error',
        err?.data
      )
    } finally {
      pending.value = false
    }
  }

  const refresh = () => execute()

  // Execute immediately if requested
  if (immediate && process.client) {
    execute()
  }

  return {
    data: readonly(data),
    pending: readonly(pending),
    error: readonly(error),
    execute,
    refresh
  }
}

/**
 * Nuxt 3 composable for lazy API calls (SSR-friendly)
 */
export function useLazyApiCall<T>(
  url: string | (() => string),
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: any
    query?: Record<string, any>
    headers?: Record<string, string>
    server?: boolean
    default?: () => T
    transform?: (data: any) => T
  } = {}
) {
  return useApiCall(url, {
    ...options,
    immediate: false
  })
}

/**
 * Nuxt 3 composable for authentication-aware API calls
 */
export function useAuthenticatedApi() {
  const isAuthenticated = computed(() => {
    const token = getToken()
    return token && !isTokenExpired(token)
  })

  const apiGet = async <T>(url: string, options = {}) => {
    if (!isAuthenticated.value) {
      throw new ApiError(401, 'Not authenticated')
    }
    return nuxtApiGet<T>(url, options)
  }

  const apiPost = async <T>(url: string, data: any, options = {}) => {
    if (!isAuthenticated.value) {
      throw new ApiError(401, 'Not authenticated')
    }
    return nuxtApiPost<T>(url, data, options)
  }

  const apiPut = async <T>(url: string, data: any, options = {}) => {
    if (!isAuthenticated.value) {
      throw new ApiError(401, 'Not authenticated')
    }
    return nuxtApiPut<T>(url, data, options)
  }

  const apiDelete = async <T>(url: string, options = {}) => {
    if (!isAuthenticated.value) {
      throw new ApiError(401, 'Not authenticated')
    }
    return nuxtApiDelete<T>(url, options)
  }

  return {
    isAuthenticated,
    apiGet,
    apiPost,
    apiPut,
    apiDelete
  }
}

/**
 * Example usage in Nuxt 3 components
 */
export function useUserManagement() {
  // Fetch users with reactive state
  const { data: users, pending: loadingUsers, error: usersError, refresh: refreshUsers } = 
    useApiCall<any[]>('/api/users', {
      default: () => [],
      transform: (response) => response.data?.users || response
    })

  // Create user function
  const createUser = async (userData: any) => {
    try {
      const newUser = await nuxtApiPost('/api/user/create', userData)
      await refreshUsers() // Refresh the users list
      return newUser
    } catch (error) {
      console.error('Failed to create user:', error)
      throw error
    }
  }

  // Update user function
  const updateUser = async (userId: string, updates: any) => {
    try {
      const updatedUser = await nuxtApiPut(`/api/user/${userId}`, updates)
      await refreshUsers() // Refresh the users list
      return updatedUser
    } catch (error) {
      console.error('Failed to update user:', error)
      throw error
    }
  }

  // Delete user function
  const deleteUser = async (userId: string) => {
    try {
      await nuxtApiDelete(`/api/user/${userId}`)
      await refreshUsers() // Refresh the users list
    } catch (error) {
      console.error('Failed to delete user:', error)
      throw error
    }
  }

  return {
    users,
    loadingUsers,
    usersError,
    refreshUsers,
    createUser,
    updateUser,
    deleteUser
  }
}