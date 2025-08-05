import { authenticateToken } from '../../utils/auth'
import type { UpdateOrderData } from '~/composables/interfaces/order'

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

    const body = await readBody(event) as UpdateOrderData
    const { status, paymentStatus, paymentMethod, notes, shippedAt, deliveredAt } = body

    // In a real application, check if order exists
    const orderExists = true // Mock check
    if (!orderExists) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Order not found'
      })
    }

    // Validate status transitions
    if (status) {
      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
      if (!validStatuses.includes(status)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid order status'
        })
      }
    }

    if (paymentStatus) {
      const validPaymentStatuses = ['pending', 'paid', 'partial', 'failed', 'refunded']
      if (!validPaymentStatuses.includes(paymentStatus)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid payment status'
        })
      }
    }

    // Build update data
    const updateData: any = {
      updatedAt: new Date().toISOString(),
      updatedBy: userId
    }

    if (status !== undefined) updateData.status = status
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod
    if (notes !== undefined) updateData.notes = notes
    if (shippedAt !== undefined) updateData.shippedAt = shippedAt
    if (deliveredAt !== undefined) updateData.deliveredAt = deliveredAt

    // Auto-set timestamps based on status
    if (status === 'shipped' && !shippedAt) {
      updateData.shippedAt = new Date().toISOString()
    }
    if (status === 'delivered' && !deliveredAt) {
      updateData.deliveredAt = new Date().toISOString()
    }

    // In a real application, update the order in database
    console.log('Updating order:', orderId, 'with data:', updateData)

    // Mock updated order response
    const updatedOrder = {
      _id: orderId,
      ...updateData,
      orderNumber: 'ORD-2024-001', // Mock data
      total: 284.30 // Mock data
    }

    return {
      success: true,
      data: {
        order: updatedOrder
      },
      message: 'Order updated successfully'
    }

  } catch (error: any) {
    console.error('Update order error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update order'
    })
  }
})