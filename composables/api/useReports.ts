import { nuxtApiGet } from '~/utils/apiClientNuxt'
import { ApiError } from '~/utils/apiTypes'

interface TopProduct {
  id: string
  name: string
  sales: number
  revenue: number
  percentage: number
}

interface CategorySales {
  name: string
  sales: number
  revenue: number
  growth: number
}

interface Reports {
  totalRevenue: number
  revenueTrend: number
  totalOrders: number
  ordersTrend: number
  totalCustomers: number
  customersTrend: number
  avgOrderValue: number
  avgOrderTrend: number
  newCustomers: number
  returningCustomers: number
  customerLifetimeValue: number
  topProducts: TopProduct[]
  salesByCategory: CategorySales[]
}

interface ReportFilters {
  timeRange?: string
  type?: string
}

export const useReports = () => {
  const reports = ref<Reports>({
    totalRevenue: 0,
    revenueTrend: 0,
    totalOrders: 0,
    ordersTrend: 0,
    totalCustomers: 0,
    customersTrend: 0,
    avgOrderValue: 0,
    avgOrderTrend: 0,
    newCustomers: 0,
    returningCustomers: 0,
    customerLifetimeValue: 0,
    topProducts: [],
    salesByCategory: []
  })
  
  const loading = ref(false)
  const error = ref('')

  const fetchReports = async (filters: ReportFilters = {}) => {
    loading.value = true
    error.value = ''

    try {
      // For now, we'll use mock data since we don't have reports API endpoints yet
      // In a real application, you would uncomment the API call below
      /*
      const query = new URLSearchParams()
      
      if (filters.timeRange) query.append('timeRange', filters.timeRange)
      if (filters.type) query.append('type', filters.type)

      const response = await nuxtApiGet<{
        success: boolean
        data?: Reports
        message?: string
      }>(`/api/reports${query.toString() ? '?' + query.toString() : ''}`)

      if (response.success && response.data) {
        reports.value = response.data
      } else {
        throw new Error(response.message || 'Failed to fetch reports')
      }
      */

      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API delay
      
      // Generate mock data based on filters
      const mockReports: Reports = {
        totalRevenue: filters.timeRange === '7d' ? 25430 : 
                     filters.timeRange === '30d' ? 89250 :
                     filters.timeRange === '90d' ? 234560 : 850340,
        revenueTrend: Math.random() > 0.5 ? 
                     Math.floor(Math.random() * 25) : 
                     -Math.floor(Math.random() * 15),
        totalOrders: filters.timeRange === '7d' ? 142 : 
                    filters.timeRange === '30d' ? 567 :
                    filters.timeRange === '90d' ? 1234 : 4567,
        ordersTrend: Math.random() > 0.5 ? 
                    Math.floor(Math.random() * 20) : 
                    -Math.floor(Math.random() * 10),
        totalCustomers: filters.timeRange === '7d' ? 89 : 
                       filters.timeRange === '30d' ? 342 :
                       filters.timeRange === '90d' ? 789 : 2456,
        customersTrend: Math.random() > 0.5 ? 
                       Math.floor(Math.random() * 30) : 
                       -Math.floor(Math.random() * 12),
        avgOrderValue: filters.timeRange === '7d' ? 179.15 : 
                      filters.timeRange === '30d' ? 157.32 :
                      filters.timeRange === '90d' ? 190.12 : 186.45,
        avgOrderTrend: Math.random() > 0.5 ? 
                      Math.floor(Math.random() * 15) : 
                      -Math.floor(Math.random() * 8),
        newCustomers: filters.timeRange === '7d' ? 23 : 
                     filters.timeRange === '30d' ? 89 :
                     filters.timeRange === '90d' ? 234 : 567,
        returningCustomers: filters.timeRange === '7d' ? 66 : 
                           filters.timeRange === '30d' ? 253 :
                           filters.timeRange === '90d' ? 555 : 1889,
        customerLifetimeValue: 450.75,
        topProducts: [
          {
            id: '1',
            name: 'Wireless Headphones',
            sales: 234,
            revenue: 23450,
            percentage: 28.5
          },
          {
            id: '2',
            name: 'Smartphone Case',
            sales: 189,
            revenue: 3780,
            percentage: 22.1
          },
          {
            id: '3',
            name: 'Bluetooth Speaker',
            sales: 156,
            revenue: 12480,
            percentage: 18.2
          },
          {
            id: '4',
            name: 'USB Cable',
            sales: 234,
            revenue: 2340,
            percentage: 15.8
          },
          {
            id: '5',
            name: 'Phone Charger',
            sales: 123,
            revenue: 2460,
            percentage: 15.4
          }
        ],
        salesByCategory: [
          {
            name: 'Electronics',
            sales: 456,
            revenue: 45600,
            growth: 12.5
          },
          {
            name: 'Accessories',
            sales: 234,
            revenue: 11700,
            growth: 8.3
          },
          {
            name: 'Clothing',
            sales: 189,
            revenue: 18900,
            growth: -3.2
          },
          {
            name: 'Home & Garden',
            sales: 123,
            revenue: 9840,
            growth: 15.7
          },
          {
            name: 'Books',
            sales: 78,
            revenue: 1560,
            growth: -1.5
          },
          {
            name: 'Sports',
            sales: 67,
            revenue: 6700,
            growth: 22.1
          }
        ]
      }

      reports.value = mockReports

    } catch (err) {
      if (err instanceof ApiError) {
        error.value = err.data?.message || err.message || 'Failed to load reports'
      } else {
        error.value = 'An unexpected error occurred'
      }
      console.error('Reports fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const exportReports = async (format: 'csv' | 'pdf' | 'xlsx' = 'csv', filters: ReportFilters = {}) => {
    try {
      const query = new URLSearchParams()
      
      if (filters.timeRange) query.append('timeRange', filters.timeRange)
      if (filters.type) query.append('type', filters.type)
      query.append('format', format)

      // In a real application, this would trigger a file download
      const response = await nuxtApiGet<{
        success: boolean
        data?: { downloadUrl: string }
        message?: string
      }>(`/api/reports/export${query.toString() ? '?' + query.toString() : ''}`)

      if (response.success && response.data) {
        // Trigger file download
        window.open(response.data.downloadUrl, '_blank')
      } else {
        throw new Error(response.message || 'Failed to export reports')
      }
    } catch (err) {
      if (err instanceof ApiError) {
        throw new Error(err.data?.message || err.message || 'Failed to export reports')
      } else {
        throw new Error('An unexpected error occurred')
      }
    }
  }

  const refreshReports = (filters: ReportFilters = {}) => {
    return fetchReports(filters)
  }

  return {
    reports: readonly(reports),
    loading: readonly(loading),
    error: readonly(error),
    fetchReports,
    exportReports,
    refreshReports
  }
}