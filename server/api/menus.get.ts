import { authenticateToken } from '../utils/auth'
import { connectDB } from '../utils/db'
import { Menu } from '../models/Menu'
import { Role } from '../models/Role'
import { Permission } from '../models/Permission'

export default defineEventHandler(async (event) => {
  try {
    const decoded = await authenticateToken(event)
    const userRole = decoded.role

    if (!userRole) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User role not found'
      })
    }

    // Connect to MongoDB
    await connectDB()

    // Get all menus and filter by user role
    const allMenus = await Menu.find({
      roles: userRole,
      isActive: true
    }).sort({ order: 1 }).lean()

    // Build menu tree structure
    const menuTree = buildMenuTree(allMenus)

    return {
      success: true,
      message: 'Menus retrieved successfully',
      data: {
        menus: menuTree
      }
    }

  } catch (error: any) {
    console.error('Get menus error:', error)
    
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
      statusMessage: 'Internal server error'
    })
  }
})

// Helper function to build menu tree structure
function buildMenuTree(menus: any[]): any[] {
  const menuMap = new Map<string, any>()
  const rootMenus: any[] = []

  // Create a map of all menus
  menus.forEach(menu => {
    menuMap.set(menu._id.toString(), { ...menu, children: [] })
  })

  // Build the tree structure
  menus.forEach(menu => {
    const menuItem = menuMap.get(menu._id.toString())!
    
    if (menu.parent) {
      const parent = menuMap.get(menu.parent.toString())
      if (parent) {
        parent.children.push(menuItem)
      } else {
        // Parent not found, treat as root
        rootMenus.push(menuItem)
      }
    } else {
      rootMenus.push(menuItem)
    }
  })

  return rootMenus.sort((a, b) => a.order - b.order)
}