import type { User, LoginCredentials, RegisterData } from '../interfaces/user'
import { apiLogin, apiLogout, apiRegister, apiMe } from '../constants/api-endpoints'

export const useAuth = () => {
  const user = useState<User | null>('auth.user', () => null)
  const token = useCookie<string | null>('auth-token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    default: () => null
  })

  const isLoggedIn = computed(() => !!user.value && !!token.value)
  
  const login = async (credentials: LoginCredentials) => {
    try {
      const { data } = await $fetch<{
        success: boolean
        data: { user: User; token: string }
      }>(apiLogin, {
        method: 'POST',
        body: credentials
      })

      if (data.user && data.token) {
        user.value = data.user
        token.value = data.token
        
        await navigateTo('/dashboard')
        return { success: true }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.data?.statusMessage || 'Login failed' 
      }
    }
  }

  const register = async (registerData: RegisterData) => {
    try {
      const { data } = await $fetch<{
        success: boolean
        data: { user: User; token: string }
      }>(apiRegister, {
        method: 'POST',
        body: registerData
      })

      if (data.user && data.token) {
        user.value = data.user
        token.value = data.token
        
        await navigateTo('/dashboard')
        return { success: true }
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      return { 
        success: false, 
        error: error.data?.statusMessage || 'Registration failed' 
      }
    }
  }

  const logout = async () => {
    try {
      await $fetch(apiLogout, { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
      token.value = null
      await navigateTo('/login')
    }
  }

  const fetchUser = async () => {
    if (!token.value) return

    try {
      const { data } = await $fetch<{
        success: boolean
        data: { user: User }
      }>(apiMe, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      if (data.user) {
        user.value = data.user
      }
    } catch (error) {
      console.error('Fetch user error:', error)
      // If token is invalid, clear it
      user.value = null
      token.value = null
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user.value?.role?.permissions) return false
    return user.value.role.permissions.some(p => p.name === permission)
  }

  const hasRole = (role: string | string[]): boolean => {
    if (!user.value?.role?.name) return false
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(user.value.role.name)
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isLoggedIn,
    login,
    register,
    logout,
    fetchUser,
    hasPermission,
    hasRole
  }
}