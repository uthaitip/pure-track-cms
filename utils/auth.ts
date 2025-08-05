/**
 * Authentication token management utilities
 * Handles token storage in localStorage with proper error handling
 */

const TOKEN_KEY = 'access_token'

/**
 * Store authentication token in localStorage
 * @param token - JWT token string
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') {
    console.warn('setToken: localStorage not available (SSR environment)')
    return
  }
  
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch (error) {
    console.error('Failed to save token to localStorage:', error)
  }
}

/**
 * Retrieve authentication token from localStorage
 * @returns token string or null if not found
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch (error) {
    console.error('Failed to retrieve token from localStorage:', error)
    return null
  }
}

/**
 * Remove authentication token from localStorage
 */
export function removeToken(): void {
  if (typeof window === 'undefined') {
    console.warn('removeToken: localStorage not available (SSR environment)')
    return
  }
  
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch (error) {
    console.error('Failed to remove token from localStorage:', error)
  }
}

/**
 * Check if user is authenticated (has valid token)
 * @returns boolean indicating authentication status
 */
export function isAuthenticated(): boolean {
  const token = getToken()
  return token !== null && token.length > 0
}

/**
 * Parse JWT token to extract payload (without verification)
 * @param token - JWT token string
 * @returns parsed payload or null if invalid
 */
export function parseToken(token?: string): any | null {
  const authToken = token || getToken()
  
  if (!authToken) return null
  
  try {
    const payload = authToken.split('.')[1]
    if (!payload) return null
    
    const decoded = atob(payload)
    return JSON.parse(decoded)
  } catch (error) {
    console.error('Failed to parse token:', error)
    return null
  }
}

/**
 * Check if token is expired
 * @param token - JWT token string (optional, uses stored token if not provided)
 * @returns boolean indicating if token is expired
 */
export function isTokenExpired(token?: string): boolean {
  const payload = parseToken(token)
  
  if (!payload || !payload.exp) return true
  
  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp < currentTime
}