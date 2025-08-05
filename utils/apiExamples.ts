/**
 * API Client Usage Examples
 * Demonstrates how to use the API helper functions in various scenarios
 */

import { 
  apiGet, 
  apiPost, 
  apiPut, 
  apiDelete, 
  apiCall, 
  apiUpload,
  ApiError 
} from './apiClient'
import { setToken, getToken, removeToken, isAuthenticated } from './auth'

// ========================================
// AUTHENTICATION EXAMPLES
// ========================================

/**
 * Example: User login
 */
export async function loginExample(email: string, password: string) {
  try {
    const response = await apiPost('/api/auth/login', {
      email,
      password
    })

    if (response.success && response.data?.token) {
      // Store the token
      setToken(response.data.token)
      
      console.log('Login successful:', response.data.user)
      return response.data
    }
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Login failed:', error.data?.message || error.message)
    }
    throw error
  }
}

/**
 * Example: User logout
 */
export async function logoutExample() {
  try {
    // Call logout endpoint (optional)
    await apiPost('/api/auth/logout', {})
    
    // Remove token from storage
    removeToken()
    
    console.log('Logout successful')
  } catch (error) {
    // Even if API call fails, remove token locally
    removeToken()
    console.warn('Logout API call failed, but token removed locally')
  }
}

// ========================================
// BASIC API CALLS
// ========================================

/**
 * Example: Fetch user profile
 */
export async function fetchUserProfile() {
  try {
    const user = await apiGet('/api/user/me')
    console.log('User profile:', user)
    return user
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        console.log('User not authenticated')
        // Redirect to login page
      } else {
        console.error('Failed to fetch profile:', error.message)
      }
    }
    throw error
  }
}

/**
 * Example: Create a new user
 */
export async function createUserExample(userData: {
  firstName: string
  lastName: string
  email: string
  password: string
  roleName: string
}) {
  try {
    const newUser = await apiPost('/api/user/create', userData)
    console.log('User created:', newUser)
    return newUser
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Failed to create user:', error.data?.message)
    }
    throw error
  }
}

/**
 * Example: Update user data
 */
export async function updateUserExample(userId: string, updates: {
  firstName?: string
  lastName?: string
  isActive?: boolean
}) {
  try {
    const updatedUser = await apiPut(`/api/user/${userId}`, updates)
    console.log('User updated:', updatedUser)
    return updatedUser
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Failed to update user:', error.data?.message)
    }
    throw error
  }
}

/**
 * Example: Delete user
 */
export async function deleteUserExample(userId: string) {
  try {
    await apiDelete(`/api/user/${userId}`)
    console.log('User deleted successfully')
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Failed to delete user:', error.data?.message)
    }
    throw error
  }
}

// ========================================
// ADVANCED USAGE EXAMPLES
// ========================================

/**
 * Example: Fetch data with query parameters
 */
export async function fetchUsersWithFilters(filters: {
  role?: string
  isActive?: boolean
  page?: number
  limit?: number
}) {
  try {
    // Build query string
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value))
      }
    })

    const users = await apiGet(`/api/users?${params.toString()}`)
    console.log('Filtered users:', users)
    return users
  } catch (error) {
    console.error('Failed to fetch users:', error)
    throw error
  }
}

/**
 * Example: Upload file
 */
export async function uploadFileExample(file: File, userId: string) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)

    const result = await apiUpload('/api/upload/avatar', formData)
    console.log('File uploaded:', result)
    return result
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Upload failed:', error.data?.message)
    }
    throw error
  }
}

/**
 * Example: API call with custom headers
 */
export async function fetchWithCustomHeaders() {
  try {
    const data = await apiGet('/api/data', {
      headers: {
        'X-Custom-Header': 'custom-value',
        'Accept-Language': 'en-US'
      }
    })
    return data
  } catch (error) {
    console.error('Custom headers request failed:', error)
    throw error
  }
}

/**
 * Example: Using apiCall convenience method
 */
export async function convenientApiCall() {
  try {
    // Automatically unwraps { success, data, message } responses
    const users = await apiCall('GET', '/api/users')
    const newUser = await apiCall('POST', '/api/user/create', {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    })
    
    console.log('Users:', users)
    console.log('New user:', newUser)
    
    return { users, newUser }
  } catch (error) {
    console.error('Convenient API call failed:', error)
    throw error
  }
}

// ========================================
// ERROR HANDLING EXAMPLES
// ========================================

/**
 * Example: Comprehensive error handling
 */
export async function robustApiCall() {
  try {
    const data = await apiGet('/api/some-endpoint')
    return data
  } catch (error) {
    if (error instanceof ApiError) {
      switch (error.status) {
        case 400:
          console.error('Bad Request:', error.data?.message)
          // Handle validation errors
          break
        case 401:
          console.error('Unauthorized - redirecting to login')
          removeToken()
          // Redirect to login page
          window.location.href = '/login'
          break
        case 403:
          console.error('Forbidden - insufficient permissions')
          // Show permission denied message
          break
        case 404:
          console.error('Resource not found')
          // Handle not found
          break
        case 500:
          console.error('Server error:', error.data?.message)
          // Show generic error message
          break
        default:
          console.error('API Error:', error.message)
      }
    } else {
      console.error('Network or unknown error:', error)
    }
    throw error
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Example: Check authentication status
 */
export function checkAuthStatus() {
  const authenticated = isAuthenticated()
  const token = getToken()
  
  console.log('Authentication status:', {
    isAuthenticated: authenticated,
    hasToken: !!token,
    tokenLength: token?.length || 0
  })
  
  return authenticated
}

/**
 * Example: Batch API calls
 */
export async function batchApiCalls() {
  try {
    // Execute multiple API calls in parallel
    const [profile, users, menus] = await Promise.all([
      apiGet('/api/user/me'),
      apiGet('/api/users'),
      apiGet('/api/menus')
    ])

    console.log('Batch results:', { profile, users, menus })
    return { profile, users, menus }
  } catch (error) {
    console.error('Batch API calls failed:', error)
    throw error
  }
}

/**
 * Example: Retry logic for failed requests
 */
export async function retryApiCall(
  apiFunction: () => Promise<any>,
  maxRetries: number = 3,
  delay: number = 1000
) {
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiFunction()
    } catch (error) {
      lastError = error
      
      if (error instanceof ApiError && error.status < 500) {
        // Don't retry client errors (4xx)
        throw error
      }
      
      if (attempt === maxRetries) {
        throw lastError
      }
      
      console.warn(`API call failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
      delay *= 2 // Exponential backoff
    }
  }
  
  throw lastError
}

// ========================================
// USAGE IN COMPONENTS
// ========================================

/**
 * Example: Vue 3 Composition API usage
 */
export function useApiExample() {
  const { ref, onMounted } = require('vue') // In real usage, import from 'vue'
  
  const users = ref([])
  const loading = ref(false)
  const error = ref('')

  const fetchUsers = async () => {
    loading.value = true
    error.value = ''
    
    try {
      users.value = await apiGet('/api/users')
    } catch (err) {
      error.value = err instanceof ApiError ? err.data?.message : 'Failed to fetch users'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchUsers()
  })

  return {
    users,
    loading,
    error,
    fetchUsers
  }
}

/**
 * Example: React Hook usage
 */
export function useApiExampleReact() {
  // In real usage, import from 'react'
  const { useState, useEffect } = require('react')
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    
    try {
      const data = await apiGet('/api/users')
      setUsers(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.data?.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    loading,
    error,
    fetchUsers
  }
}