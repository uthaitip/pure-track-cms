/**
 * API Client utilities with automatic token management
 * Provides consistent HTTP methods with built-in authentication
 */

import { getToken, isTokenExpired, removeToken } from './auth'
import { ApiError, type ApiResponse } from './apiTypes'

/**
 * Get base URL from environment or use default
 */
function getBaseUrl(): string {
  // For Nuxt 3, you can use: useRuntimeConfig().public.baseURL
  // For other frameworks, use environment variables or constants
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.API_BASE_URL || 'http://localhost:3000'
}

/**
 * Create headers with authentication and content type
 */
function createHeaders(options?: RequestInit): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) || {})
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
 * Process API response and handle errors
 */
async function processResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type')
  const isJson = contentType && contentType.includes('application/json')
  
  let data: any
  try {
    data = isJson ? await response.json() : await response.text()
  } catch (error) {
    throw new ApiError(response.status, response.statusText, 'Failed to parse response')
  }

  if (!response.ok) {
    // Handle different error response formats
    const errorMessage = data?.message || data?.error || data?.statusMessage || response.statusText
    throw new ApiError(response.status, response.statusText, {
      message: errorMessage,
      details: data
    })
  }

  return data
}

/**
 * Generic API request function
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${getBaseUrl()}${endpoint}`
  
  const config: RequestInit = {
    ...options,
    headers: createHeaders(options)
  }

  try {
    const response = await fetch(url, config)
    return await processResponse<T>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle specific API errors
      if (error.status === 401) {
        removeToken()
        console.warn('Unauthorized request - token may be invalid')
        
        // Optionally redirect to login page
        if (typeof window !== 'undefined') {
          // window.location.href = '/login'
        }
      }
      throw error
    }
    
    // Handle network or other errors
    throw new ApiError(0, 'Network Error', {
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    })
  }
}

/**
 * GET request
 */
export async function apiGet<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  return apiRequest<T>(url, {
    method: 'GET',
    ...options
  })
}

/**
 * POST request
 */
export async function apiPost<T = any>(
  url: string,
  data: any,
  options?: RequestInit
): Promise<T> {
  return apiRequest<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  })
}

/**
 * PUT request
 */
export async function apiPut<T = any>(
  url: string,
  data: any,
  options?: RequestInit
): Promise<T> {
  return apiRequest<T>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options
  })
}

/**
 * PATCH request
 */
export async function apiPatch<T = any>(
  url: string,
  data: any,
  options?: RequestInit
): Promise<T> {
  return apiRequest<T>(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
    ...options
  })
}

/**
 * DELETE request
 */
export async function apiDelete<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  return apiRequest<T>(url, {
    method: 'DELETE',
    ...options
  })
}

/**
 * Upload file with form data
 */
export async function apiUpload<T = any>(
  url: string,
  formData: FormData,
  options?: RequestInit
): Promise<T> {
  // Remove Content-Type header to let browser set it with boundary
  const { headers, ...restOptions } = options || {}
  const uploadHeaders = { ...headers } as Record<string, string>
  delete uploadHeaders['Content-Type']

  return apiRequest<T>(url, {
    method: 'POST',
    body: formData,
    ...restOptions,
    headers: {
      ...createHeaders({ headers: uploadHeaders }),
      ...uploadHeaders
    }
  })
}

/**
 * Convenience method for API calls with automatic response unwrapping
 * Assumes response has { success, data, message } structure
 */
export async function apiCall<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  let response: ApiResponse<T>

  switch (method) {
    case 'GET':
      response = await apiGet<ApiResponse<T>>(url, options)
      break
    case 'POST':
      response = await apiPost<ApiResponse<T>>(url, data, options)
      break
    case 'PUT':
      response = await apiPut<ApiResponse<T>>(url, data, options)
      break
    case 'PATCH':
      response = await apiPatch<ApiResponse<T>>(url, data, options)
      break
    case 'DELETE':
      response = await apiDelete<ApiResponse<T>>(url, options)
      break
  }

  if (response.success && response.data !== undefined) {
    return response.data
  }

  throw new ApiError(400, 'API Error', {
    message: response.message || response.error || 'Request failed',
    response
  })
}

// Export types for external use
export { type ApiResponse }