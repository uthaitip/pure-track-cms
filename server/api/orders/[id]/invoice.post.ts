import { authenticateToken } from '../../../utils/auth'
import type { Invoice, Order } from '~/composables/interfaces/order'

// Mock order data (in real app, fetch from database)
const getMockOrder = (orderId: string): Order | null => {
  const mockOrders = [
    {
      _id: 'order_1',
      orderNumber: 'ORD-2024-001',
      customer: {
        _id: 'cust_1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1-555-0123',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      items: [
        {
          _id: 'item_1',
          productId: 'prod_1',
          productName: 'Wireless Bluetooth Headphones',
          productSku: 'WH-001',
          quantity: 2,
          unitPrice: 99.99,
          totalPrice: 199.98,
          discount: 0,
          tax: 16.00
        }
      ],
      subtotal: 199.98,
      tax: 16.00,
      discount: 0,
      shipping: 10.00,
      total: 225.98,
      status: 'confirmed' as const,
      paymentStatus: 'paid' as const,
      paymentMethod: 'card' as const,
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user_1',
      invoiceGenerated: false
    }
  ]
  
  return mockOrders.find(order => order._id === orderId) || null
}

export default defineEventHandler(async (event) => {
  try {
    const decoded = await authenticateToken(event)
    const userId = decoded.userId

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID not found'
      })
    }

    const orderId = getRouterParam(event, 'id')
    if (!orderId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Order ID is required'
      })
    }

    // Fetch order
    const order = getMockOrder(orderId)
    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Order not found'
      })
    }

    // Check if invoice already exists
    if (order.invoiceGenerated && order.invoiceNumber) {
      return {
        success: true,
        data: {
          invoice: {
            _id: `inv_${orderId}`,
            invoiceNumber: order.invoiceNumber,
            orderId: order._id,
            order,
            customer: order.customer,
            items: order.items,
            subtotal: order.subtotal,
            tax: order.tax,
            discount: order.discount,
            total: order.total,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'sent' as const,
            notes: order.notes,
            createdAt: order.createdAt,
            updatedAt: new Date().toISOString(),
            createdBy: userId
          }
        },
        message: 'Invoice already exists'
      }
    }

    // Generate invoice number if not exists
    const invoiceNumber = order.invoiceNumber || `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`

    // Create invoice
    const invoice: Invoice = {
      _id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      invoiceNumber,
      orderId: order._id,
      order,
      customer: order.customer,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      discount: order.discount,
      total: order.total,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      status: 'draft',
      notes: order.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId
    }

    // In a real application:
    // 1. Save invoice to database
    // 2. Update order to mark invoice as generated
    // 3. Send email to customer if requested
    // 4. Generate PDF

    console.log('Invoice generated:', invoice)

    return {
      success: true,
      data: {
        invoice,
        pdfUrl: `/api/invoices/${invoice._id}/pdf`, // Mock PDF URL
        emailSent: false
      },
      message: 'Invoice generated successfully'
    }

  } catch (error: any) {
    console.error('Generate invoice error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate invoice'
    })
  }
})