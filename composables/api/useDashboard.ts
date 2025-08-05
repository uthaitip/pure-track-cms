import { nuxtApiGet } from '~/utils/apiClientNuxt'
import { ApiError } from '~/utils/apiTypes'

interface DashboardStats {
  users: number
  products: number
  orders: number
  revenue: number
  usersTrend: {
    value: number
    label: string
    type: 'up' | 'down' | 'neutral'
  }
  productsTrend: {
    value: number
    label: string
    type: 'up' | 'down' | 'neutral'
  }
  ordersTrend: {
    value: number
    label: string
    type: 'up' | 'down' | 'neutral'
  }
  revenueTrend: {
    value: number
    label: string
    type: 'up' | 'down' | 'neutral'
  }
}

interface Activity {
  id: string
  message: string
  type: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'
  timestamp: string
}

export const useDashboard = () => {
  const dashboardStats = ref<DashboardStats>({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    usersTrend: { value: 0, label: '0%', type: 'neutral' },
    productsTrend: { value: 0, label: '0%', type: 'neutral' },
    ordersTrend: { value: 0, label: '0%', type: 'neutral' },
    revenueTrend: { value: 0, label: '0%', type: 'neutral' }
  })

  const recentActivity = ref<Activity[]>([])
  const loading = ref(false)
  const error = ref('')

  const fetchDashboardData = async () => {
    loading.value = true
    error.value = ''

    try {
      // In a real app, you would have dedicated dashboard API endpoints
      // For now, we'll fetch from existing endpoints and calculate stats
      
      // Fetch users count
      const usersResponse = await nuxtApiGet<{
        success: boolean
        data: { users: any[], pagination: { total: number } }
      }>('/api/users?limit=1')

      if (usersResponse.success) {
        dashboardStats.value.users = usersResponse.data?.pagination?.total || 0
        dashboardStats.value.usersTrend = {
          value: 22,
          label: '↗︎ 22%',
          type: 'up'
        }
      }

      // Mock data for other stats (you would replace with real API calls)
      dashboardStats.value.products = 156
      dashboardStats.value.orders = 89
      dashboardStats.value.revenue = 45230

      dashboardStats.value.productsTrend = {
        value: 12,
        label: '↗︎ 12%',
        type: 'up'
      }

      dashboardStats.value.ordersTrend = {
        value: -5,
        label: '↘︎ 5%',
        type: 'down'
      }

      dashboardStats.value.revenueTrend = {
        value: 18,
        label: '↗︎ 18%',
        type: 'up'
      }

      // Mock recent activity
      recentActivity.value = [
        {
          id: '1',
          message: 'New user registered',
          type: 'primary',
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          message: 'Payment received',
          type: 'success',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          message: 'New order placed',
          type: 'accent',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          message: 'Product updated',
          type: 'secondary',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        }
      ]

    } catch (err) {
      if (err instanceof ApiError) {
        error.value = err.data?.message || err.message || 'Failed to load dashboard data'
      } else {
        error.value = 'An unexpected error occurred'
      }
      console.error('Dashboard data fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    dashboardStats: readonly(dashboardStats),
    recentActivity: readonly(recentActivity),
    loading: readonly(loading),
    error: readonly(error),
    fetchDashboardData
  }
}