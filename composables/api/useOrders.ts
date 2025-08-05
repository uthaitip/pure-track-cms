import type { Order, CreateOrderData, UpdateOrderData, OrderFilter, Invoice, OrderReport } from '../interfaces/order'
import { useAuth } from './useAuth'

export const useOrders = () => {
  const orders = useState<Order[]>('app.orders', () => [])
  const loading = useState<boolean>('app.orders.loading', () => false)
  const error = useState<string>('app.orders.error', () => '')
  const pagination = useState('app.orders.pagination', () => ({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  }))

  // Fetch orders with optional filters
  const fetchOrders = async (filters?: OrderFilter) => {
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
      if (filters?.search) queryParams.append('search', filters.search)
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.paymentStatus) queryParams.append('paymentStatus', filters.paymentStatus)
      if (filters?.customerId) queryParams.append('customerId', filters.customerId)
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo)
      if (filters?.page) queryParams.append('page', filters.page.toString())
      if (filters?.limit) queryParams.append('limit', filters.limit.toString())
      if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy)
      if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder)

      const queryString = queryParams.toString()
      const url = `/api/orders${queryString ? '?' + queryString : ''}`

      const response = await useFetch( `/api/orders`);
      console.log('-------response => ', response);

      const { data } = await $fetch<{
        success: boolean
        data: {
          orders: Order[]
          pagination: {
            page: number
            limit: number
            total: number
            pages: number
          }
          stats: any
        }
      }>(url, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      console.log('order ===> ', data);

      if (data.orders) {
        orders.value = data.orders
        pagination.value = data.pagination
      }
    } catch (err: any) {
      console.error('Fetch orders error:', err)
      error.value = err.data?.statusMessage || 'Failed to fetch orders'
    } finally {
      loading.value = false
    }
  }

  // Get order by ID
  const getOrderById = async (orderId: string): Promise<Order | null> => {
    const { token } = useAuth()
    
    if (!token.value) {
      throw new Error('Authentication required')
    }

    try {
      const { data } = await $fetch<{
        success: boolean
        data: { order: Order }
      }>(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      return data.order
    } catch (err: any) {
      console.error('Get order error:', err)
      throw new Error(err.data?.statusMessage || 'Failed to get order')
    }
  }

  // Create new order
  const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
    const { token } = useAuth()
    
    if (!token.value) {
      throw new Error('Authentication required')
    }

    try {
      const { data } = await $fetch<{
        success: boolean
        data: { order: Order, stockReductions: any[] }
        message: string
      }>('/api/orders/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: orderData
      })

      // Add new order to local state
      orders.value.unshift(data.order)
      pagination.value.total++

      return data.order
    } catch (err: any) {
      console.error('Create order error:', err)
      throw new Error(err.data?.statusMessage || 'Failed to create order')
    }
  }

  // Update order
  const updateOrder = async (orderId: string, orderData: UpdateOrderData): Promise<Order> => {
    const { token } = useAuth()
    
    if (!token.value) {
      throw new Error('Authentication required')
    }

    try {
      const { data } = await $fetch<{
        success: boolean
        data: { order: Partial<Order> }
        message: string
      }>(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: orderData
      })

      // Update order in local state
      const index = orders.value.findIndex(o => o._id === orderId)
      if (index !== -1) {
        orders.value[index] = { ...orders.value[index], ...data.order }
      }

      return orders.value[index]
    } catch (err: any) {
      console.error('Update order error:', err)
      throw new Error(err.data?.statusMessage || 'Failed to update order')
    }
  }

  // Generate invoice for order
  const generateInvoice = async (orderId: string): Promise<Invoice> => {
    const { token } = useAuth()
    
    if (!token.value) {
      throw new Error('Authentication required')
    }

    try {
      const { data } = await $fetch<{
        success: boolean
        data: { invoice: Invoice, pdfUrl?: string }
        message: string
      }>(`/api/orders/${orderId}/invoice`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      // Update order to mark invoice as generated
      const orderIndex = orders.value.findIndex(o => o._id === orderId)
      if (orderIndex !== -1) {
        orders.value[orderIndex].invoiceGenerated = true
        orders.value[orderIndex].invoiceNumber = data.invoice.invoiceNumber
      }

      return data.invoice
    } catch (err: any) {
      console.error('Generate invoice error:', err)
      throw new Error(err.data?.statusMessage || 'Failed to generate invoice')
    }
  }

  // Get sales report
  const getSalesReport = async (period: string = 'month', dateFrom?: string, dateTo?: string): Promise<OrderReport> => {
    const { token } = useAuth()
    
    if (!token.value) {
      throw new Error('Authentication required')
    }

    try {
      const queryParams = new URLSearchParams()
      queryParams.append('period', period)
      if (dateFrom) queryParams.append('dateFrom', dateFrom)
      if (dateTo) queryParams.append('dateTo', dateTo)

      const { data } = await $fetch<{
        success: boolean
        data: { report: OrderReport }
        message: string
      }>(`/api/orders/reports?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      return data.report
    } catch (err: any) {
      console.error('Get sales report error:', err)
      throw new Error(err.data?.statusMessage || 'Failed to get sales report')
    }
  }

  // Get order statistics
  const getOrderStats = () => {
    const total = orders.value.length
    const pending = orders.value.filter(o => o.status === 'pending').length
    const confirmed = orders.value.filter(o => o.status === 'confirmed').length
    const shipped = orders.value.filter(o => o.status === 'shipped').length
    const delivered = orders.value.filter(o => o.status === 'delivered').length
    const cancelled = orders.value.filter(o => o.status === 'cancelled').length
    
    // Payment status stats
    const paidOrders = orders.value.filter(o => o.paymentStatus === 'paid').length
    const pendingPayments = orders.value.filter(o => o.paymentStatus === 'pending').length
    
    // Revenue calculation
    const totalRevenue = orders.value.reduce((sum, order) => sum + order.total, 0)
    const averageOrderValue = total > 0 ? totalRevenue / total : 0

    return {
      total,
      pending,
      confirmed,
      shipped,
      delivered,
      cancelled,
      paidOrders,
      pendingPayments,
      totalRevenue,
      averageOrderValue
    }
  }

  return {
    // State
    orders: readonly(orders),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),

    // Actions
    fetchOrders,
    getOrderById,
    createOrder,
    updateOrder,
    generateInvoice,
    getSalesReport,
    getOrderStats
  }
}