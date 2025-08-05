import { authenticateToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const decoded = await authenticateToken(event)
    const userRole = decoded.role

    // Only admins and managers can delete products
    if (!['admin', 'manager'].includes(userRole)) {
      throw createError({
        statusCode: 403,
        statusMessage: `Insufficient permissions to delete products. Current role: ${userRole}. Required roles: admin, manager`
      })
    }

    const productId = getRouterParam(event, 'id')
    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID is required'
      })
    }

    // In a real application, check if product exists
    // For now, we'll simulate the existence check
    const productExists = true // Simulate product existence

    if (!productExists) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    // Check if product has any related orders or transactions
    // In a real app, you might want to soft delete instead of hard delete
    const hasRelatedData = false // Simulate check for related data

    if (hasRelatedData) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cannot delete product with existing orders or transactions. Consider deactivating instead.'
      })
    }

    // In a real application, delete from database here
    console.log('Deleted product with ID:', productId)

    return {
      success: true,
      data: {
        deletedId: productId
      },
      message: 'Product deleted successfully'
    }

  } catch (error: any) {
    console.error('Delete product error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete product'
    })
  }
})