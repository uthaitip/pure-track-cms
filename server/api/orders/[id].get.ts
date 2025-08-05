import { authenticateToken } from '../../utils/auth'
import type { Order } from '~/composables/interfaces/order'

// Mock orders data (same as in orders.get.ts)
const mockOrders: Order[] = [
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
      },
      {
        _id: 'item_2',
        productId: 'prod_2',
        productName: 'Cotton T-Shirt',
        productSku: 'TS-002',
        quantity: 3,
        unitPrice: 19.99,
        totalPrice: 59.97,
        discount: 5.97,
        tax: 4.32
      }
    ],
    subtotal: 259.95,
    tax: 20.32,
    discount: 5.97,
    shipping: 10.00,
    total: 284.30,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    notes: 'Customer requested expedited shipping',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user_1',
    updatedBy: 'user_1',
    invoiceNumber: 'INV-2024-001',
    invoiceGenerated: true
  },
  {
    _id: 'order_2',
    orderNumber: 'ORD-2024-002',
    customer: {
      _id: 'cust_2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '+1-555-0456',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    items: [
      {
        _id: 'item_3',
        productId: 'prod_6',
        productName: 'Gaming Mouse',
        productSku: 'GM-006',
        quantity: 1,
        unitPrice: 79.99,
        totalPrice: 79.99,
        discount: 0,
        tax: 6.40
      }
    ],
    subtotal: 79.99,
    tax: 6.40,
    discount: 0,
    shipping: 5.99,
    total: 92.38,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'online',
    notes: '',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user_2',
    updatedBy: 'user_1',
    invoiceNumber: 'INV-2024-002',
    invoiceGenerated: true
  },
  {
    _id: 'order_3',
    orderNumber: 'ORD-2024-003',
    customer: {
      _id: 'cust_3',
      name: 'Mike Davis',
      email: 'mike.davis@example.com',
      phone: '+1-555-0789',
      address: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    items: [
      {
        _id: 'item_4',
        productId: 'prod_4',
        productName: 'Office Chair',
        productSku: 'OC-004',
        quantity: 1,
        unitPrice: 199.99,
        totalPrice: 199.99,
        discount: 20.00,
        tax: 14.40
      }
    ],
    subtotal: 199.99,
    tax: 14.40,
    discount: 20.00,
    shipping: 15.00,
    total: 209.39,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'bank_transfer',
    notes: 'Bulk order discount applied',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user_3',
    invoiceGenerated: false
  }
]

export default defineEventHandler(async (event) => {
  try {
    const decoded = await authenticateToken(event)
    
    if (!decoded) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    const orderId = getRouterParam(event, 'id')
    if (!orderId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Order ID is required'
      })
    }

    // Find order in mock data (in real app, query database)
    const order = mockOrders.find(o => o._id === orderId)

    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Order not found'
      })
    }

    return {
      success: true,
      data: {
        order
      },
      message: 'Order retrieved successfully'
    }

  } catch (error: any) {
    console.error('Get order error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve order'
    })
  }
})