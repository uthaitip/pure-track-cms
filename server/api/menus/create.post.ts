import { connectDB } from '../../utils/db'
import { Menu } from '../../models/Menu'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, path, icon, parent, roles, order, isActive } = body

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

    // Check for duplicate paths
    const existingMenu = await Menu.findOne({ path: path.trim() }).lean()
    if (existingMenu) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Menu with this path already exists'
      })
    }

    // If parent is specified, validate it exists
    if (parent) {
      const parentMenu = await Menu.findById(parent).lean()
      if (!parentMenu) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Parent menu not found'
        })
      }
    }

    // Create new menu
    const newMenu = new Menu({
      name: name.trim(),
      path: path.trim(),
      icon: icon?.trim() || undefined,
      parent: parent || null,
      roles: roles,
      order: typeof order === 'number' ? order : 0,
      isActive: typeof isActive === 'boolean' ? isActive : true
    })

    const savedMenu = await newMenu.save()

    return {
      success: true,
      data: {
        menu: savedMenu
      },
      message: 'Menu created successfully'
    }
  } catch (error: any) {
    console.error('Create menu error:', error)
    
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
      statusMessage: 'Failed to create menu'
    })
  }
})