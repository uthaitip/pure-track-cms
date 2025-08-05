import type { User, CreateUserData, UpdateUserData } from '../interfaces/user'

export const useUsers = () => {
  const users = useState<User[]>('app.users', () => [])
  const loading = useState<boolean>('app.users.loading', () => false)
  const error = useState<string>('app.users.error', () => '')
  const pagination = useState('app.users.pagination', () => ({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  }))

  // Fetch users with optional filters
  const fetchUsers = async (params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
  }) => {
    const { token } = useAuth()
    
    if (!token.value) {
      error.value = 'Authentication required'
      return
    }

    loading.value = true
    error.value = ''

    try {
      // Build query parameters
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.role) queryParams.append('role', params.role)
      if (params?.status) queryParams.append('status', params.status)

      const queryString = queryParams.toString()
      const url = `/api/users${queryString ? '?' + queryString : ''}`

      const { data } = await $fetch<{
        success: boolean
        data: {
          users: User[]
          pagination: {
            page: number
            limit: number
            total: number
            pages: number
          }
        }
      }>(url, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      if (data.users) {
        users.value = data.users
        pagination.value = data.pagination
      }
    } catch (err: any) {
      console.error('Fetch users error:', err)
      error.value = err.data?.statusMessage || 'Failed to fetch users'
    } finally {
      loading.value = false
    }
  }

  // Get user by ID
  const getUserById = async (userId: string): Promise<User | null> => {
    const { token } = useAuth()
    
    if (!token.value) {
      throw new Error('Authentication required')
    }

    try {
      const { data } = await $fetch<{
        success: boolean
        data: { user: User }
      }>(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      return data.user
    } catch (err: any) {
      console.error('Get user error:', err)
      throw new Error(err.data?.statusMessage || 'Failed to get user')
    }
  }

  // Create new user
  const createUser = async (userData: CreateUserData): Promise<User> => {
    const { token } = useAuth()
    
    if (!token.value) {
      throw new Error('Authentication required')
    }

    try {
      const { data } = await $fetch<{
        success: boolean
        data: { user: User }
        message: string
      }>('/api/user/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: userData
      })

      // Add new user to local state
      users.value.unshift(data.user)
      pagination.value.total++

      return data.user
    } catch (err: any) {
      console.error('Create user error:', err)
      throw new Error(err.data?.statusMessage || 'Failed to create user')
    }
  }

  // Update user
  const updateUser = async (userId: string, userData: UpdateUserData): Promise<User> => {
    const { token } = useAuth()
    
    if (!token.value) {
      throw new Error('Authentication required')
    }

    try {
      const { data } = await $fetch<{
        success: boolean
        data: { user: User }
        message: string
      }>(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: userData
      })

      // Update user in local state
      const index = users.value.findIndex(u => u._id === userId)
      if (index !== -1) {
        users.value[index] = data.user
      }

      return data.user
    } catch (err: any) {
      console.error('Update user error:', err)
      throw new Error(err.data?.statusMessage || 'Failed to update user')
    }
  }

  // Delete user
  const deleteUser = async (userId: string): Promise<void> => {
    const { token } = useAuth()
    
    if (!token.value) {
      throw new Error('Authentication required')
    }

    try {
      await $fetch<{
        success: boolean
        message: string
      }>(`/api/user/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      // Remove user from local state
      users.value = users.value.filter(u => u._id !== userId)
      pagination.value.total--

    } catch (err: any) {
      console.error('Delete user error:', err)
      throw new Error(err.data?.statusMessage || 'Failed to delete user')
    }
  }

  // Get users by role
  const getUsersByRole = (role: string): User[] => {
    return users.value.filter(user => user.role.name === role)
  }

  // Get active users
  const getActiveUsers = (): User[] => {
    return users.value.filter(user => user.isActive)
  }

  // Get inactive users
  const getInactiveUsers = (): User[] => {
    return users.value.filter(user => !user.isActive)
  }

  // Search users locally
  const searchUsers = (query: string): User[] => {
    const searchTerm = query.toLowerCase()
    return users.value.filter(user =>
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    )
  }

  // Get users statistics
  const getUsersStats = () => {
    const total = users.value.length
    const active = users.value.filter(u => u.isActive).length
    const inactive = total - active
    
    // Role distribution
    const roleStats = users.value.reduce((acc, user) => {
      const role = user.role.name
      if (!acc[role]) {
        acc[role] = { total: 0, active: 0, inactive: 0 }
      }
      acc[role].total++
      if (user.isActive) {
        acc[role].active++
      } else {
        acc[role].inactive++
      }
      return acc
    }, {} as Record<string, { total: number; active: number; inactive: number }>)

    return {
      total,
      active,
      inactive,
      roleStats
    }
  }

  // Clear state
  const clearUsers = () => {
    users.value = []
    error.value = ''
    pagination.value = {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0
    }
  }

  return {
    // State
    users: readonly(users),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),

    // Actions
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    
    // Computed/Helpers
    getUsersByRole,
    getActiveUsers,
    getInactiveUsers,
    searchUsers,
    getUsersStats,
    clearUsers
  }
}