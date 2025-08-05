import { authenticateToken } from '../../utils/auth'
import type { OrderReport } from '~/composables/interfaces/order'

export default defineEventHandler(async (event) => {
  try {
    const decoded = await authenticateToken(event)
    
    if (!decoded) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    const query = getQuery(event)
    const { 
      period = 'month',
      dateFrom,
      dateTo 
    } = query

    // Mock sales data for different periods
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    // Generate mock daily sales for the past 30 days
    const dailySales = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      const orders = Math.floor(Math.random() * 20) + 5 // 5-25 orders per day
      const revenue = Math.round((Math.random() * 5000 + 1000) * 100) / 100 // $1000-$6000 per day
      
      dailySales.push({
        date: date.toISOString().split('T')[0],
        orders,
        revenue
      })
    }

    // Calculate totals
    const totalOrders = dailySales.reduce((sum, day) => sum + day.orders, 0)
    const totalRevenue = dailySales.reduce((sum, day) => sum + day.revenue, 0)
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Mock order status breakdown
    const ordersByStatus = {
      pending: Math.floor(totalOrders * 0.15),
      confirmed: Math.floor(totalOrders * 0.25),
      processing: Math.floor(totalOrders * 0.20),
      shipped: Math.floor(totalOrders * 0.25),
      delivered: Math.floor(totalOrders * 0.10),
      cancelled: Math.floor(totalOrders * 0.05)
    }

    // Mock payment method breakdown
    const paymentsByMethod = {
      cash: Math.floor(totalOrders * 0.20),
      card: Math.floor(totalOrders * 0.45),
      bank_transfer: Math.floor(totalOrders * 0.15),
      check: Math.floor(totalOrders * 0.10),
      online: Math.floor(totalOrders * 0.10)
    }

    // Mock top products
    const topProducts = [
      {
        productId: 'prod_1',
        productName: 'Wireless Bluetooth Headphones',
        quantitySold: 145,
        revenue: 14355.45
      },
      {
        productId: 'prod_6',
        productName: 'Gaming Mouse',
        quantitySold: 89,
        revenue: 7119.11
      },
      {
        productId: 'prod_2',
        productName: 'Cotton T-Shirt',
        quantitySold: 234,
        revenue: 4677.66
      },
      {
        productId: 'prod_4',
        productName: 'Office Chair',
        quantitySold: 23,
        revenue: 4599.77
      },
      {
        productId: 'prod_3',
        productName: 'Organic Green Tea',
        quantitySold: 156,
        revenue: 2418.00
      }
    ]

    const report: OrderReport = {
      period: period as string,
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      ordersByStatus,
      paymentsByMethod,
      topProducts,
      dailySales
    }

    return {
      success: true,
      data: {
        report,
        meta: {
          generatedAt: new Date().toISOString(),
          period: period,
          dateRange: {
            from: dateFrom || dailySales[0]?.date,
            to: dateTo || dailySales[dailySales.length - 1]?.date
          },
          userRole: decoded.role
        }
      },
      message: 'Sales report generated successfully'
    }

  } catch (error: any) {
    console.error('Generate sales report error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate sales report'
    })
  }
})