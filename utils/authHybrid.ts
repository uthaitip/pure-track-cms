/**
 * Hybrid authentication utilities
 * Works with both cookie (Nuxt) and localStorage token management
 */

const TOKEN_KEY = 'access_token'

/**
 * Store authentication token in both cookie and localStorage
 * @param token - JWT token string
 */
export function setTokenHybrid(token: string): void {
  // Store in localStorage (client-side)
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch (error) {
      console.error('Failed to save token to localStorage:', error)
    }
  }

  // Store in cookie (if in Nuxt environment)
  if (typeof useCookie !== 'undefined') {
    try {
      const tokenCookie = useCookie('auth-token', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      tokenCookie.value = token
    } catch (error) {
      console.warn('Cookie not available:', error)
    }
  }
}

/**
 * Retrieve authentication token from cookie or localStorage
 * @returns token string or null if not found
 */
export function getTokenHybrid(): string | null {
  // Try cookie first (if in Nuxt environment)
  if (typeof useCookie !== 'undefined') {
    try {
      const tokenCookie = useCookie('auth-token')
      if (tokenCookie.value) {
        return tokenCookie.value
      }
    } catch (error) {
      console.warn('Cookie not available:', error)
    }
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch (error) {
      console.error('Failed to retrieve token from localStorage:', error)
    }
  }

  return null
}

/**
 * Remove authentication token from both storage methods
 */
export function removeTokenHybrid(): void {
  // Remove from localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch (error) {
      console.error('Failed to remove token from localStorage:', error)
    }
  }

  // Remove from cookie
  if (typeof useCookie !== 'undefined') {
    try {
      const tokenCookie = useCookie('auth-token')
      tokenCookie.value = null
    } catch (error) {
      console.warn('Cookie not available:', error)
    }
  }
}

/**
 * Parse JWT token to extract payload (without verification)
 * @param token - JWT token string
 * @returns parsed payload or null if invalid
 */
export function parseTokenHybrid(token?: string): any | null {
  const authToken = token || getTokenHybrid()
  
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
export function isTokenExpiredHybrid(token?: string): boolean {
  const payload = parseTokenHybrid(token)
  
  if (!payload || !payload.exp) return true
  
  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp < currentTime
}

/**
 * Check if user is authenticated (has valid token)
 * @returns boolean indicating authentication status
 */
export function isAuthenticatedHybrid(): boolean {
  const token = getTokenHybrid()
  return token !== null && token.length > 0 && !isTokenExpiredHybrid(token)
}