import { connectDB } from '../../utils/db'
import { Menu } from '../../models/Menu'
import mongoose from 'mongoose'

export default defineEventHandler(async (event) => {
  try {
    const menuId = getRouterParam(event, 'id')

    if (!menuId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Menu ID is required'
      })
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(menuId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid menu ID format'
      })
    }

    // Connect to MongoDB
    await connectDB()

    // Check if menu exists
    const existingMenu = await Menu.findById(menuId).lean()
    if (!existingMenu) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Menu not found'
      })
    }

    // Check if menu has children
    const hasChildren = await Menu.countDocuments({ parent: menuId })
    if (hasChildren > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cannot delete menu with child items. Delete child items first.'
      })
    }

    // Delete menu
    const deletedMenu = await Menu.findByIdAndDelete(menuId)
    if (!deletedMenu) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete menu'
      })
    }

    return {
      success: true,
      data: {
        deletedId: menuId
      },
      message: 'Menu deleted successfully'
    }
  } catch (error: any) {
    console.error('Delete menu error:', error)
    
    if (error.statusCode) {
      throw error
    }

    // Handle MongoDB connection errors
    if (error.message?.includes('ECONNREFUSED') || error.message?.includes('MongoNetworkError')) {
      throw createError({
        statusCode: 503,
        statusMessage: 'Database connection failed'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete menu'
    })
  }
})