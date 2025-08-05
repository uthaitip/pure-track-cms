import { connectDB } from '../../utils/db'
import { Menu } from '../../models/Menu'
import mongoose from 'mongoose'

export default defineEventHandler(async (event) => {
  try {
    const menuId = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { name, path, icon, parent, roles, order, isActive } = body

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

    // Validate required fields
    if (!name || !path || !roles || !Array.isArray(roles) || roles.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: name, path, roles'
      })
    }

    // Validate path format
    if (!path.startsWith('/')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Path must start with /'
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

    // Check for duplicate paths (excluding current menu)
    const duplicatePath = await Menu.findOne({ 
      path: path.trim(),
      _id: { $ne: menuId }
    }).lean()
    
    if (duplicatePath) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Menu with this path already exists'
      })
    }

    // If parent is specified, validate it exists and isn't self-referencing
    if (parent) {
      if (parent === menuId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Menu cannot be its own parent'
        })
      }
      
      const parentMenu = await Menu.findById(parent).lean()
      if (!parentMenu) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Parent menu not found'
        })
      }
    }

    // Update menu
    const updatedMenu = await Menu.findByIdAndUpdate(
      menuId,
      {
        name: name.trim(),
        path: path.trim(),
        icon: icon?.trim() || undefined,
        parent: parent || null,
        roles: roles,
        order: typeof order === 'number' ? order : existingMenu.order,
        isActive: typeof isActive === 'boolean' ? isActive : existingMenu.isActive
      },
      { new: true, runValidators: true }
    ).lean()

    if (!updatedMenu) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update menu'
      })
    }

    return {
      success: true,
      data: {
        menu: updatedMenu
      },
      message: 'Menu updated successfully'
    }
  } catch (error: any) {
    console.error('Update menu error:', error)
    
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

    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      throw createError({
        statusCode: 400,
        statusMessage: `Validation error: ${validationErrors.join(', ')}`
      })
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Menu with this path already exists'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update menu'
    })
  }
})