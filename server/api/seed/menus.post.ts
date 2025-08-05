import { connectDB } from '../../utils/db'
import { Menu } from '../../models/Menu'

export default defineEventHandler(async (event) => {
  try {
    // Connect to MongoDB
    await connectDB()

    // Clear existing menus
    await Menu.deleteMany({})

    // Create initial menus data
    const initialMenus = [
      {
        name: 'Dashboard',
        path: '/dashboard',
        icon: 'fas fa-home',
        roles: ['admin', 'hr', 'manager', 'employee'],
        order: 1,
        isActive: true
      },
      {
        name: 'Admin Panel',
        path: '/dashboard/admin',
        icon: 'fas fa-cogs',
        roles: ['admin'],
        order: 2,
        isActive: true
      },
      {
        name: 'User Management',
        path: '/dashboard/users',
        icon: 'fas fa-users',
        roles: ['admin', 'hr'],
        order: 3,
        isActive: true
      },
      {
        name: 'Add User',
        path: '/dashboard/add-user',
        icon: 'fas fa-user-plus',
        roles: ['admin', 'hr'],
        order: 4,
        isActive: true
      },
      {
        name: 'Products',
        path: '/dashboard/products',
        icon: 'fas fa-box',
        roles: ['admin', 'manager'],
        order: 5,
        isActive: true
      },
      {
        name: 'Orders',
        path: '/dashboard/orders',
        icon: 'fas fa-shopping-cart',
        roles: ['admin', 'manager', 'employee'],
        order: 6,
        isActive: true
      },
      {
        name: 'Reports',
        path: '/dashboard/reports',
        icon: 'fas fa-chart-bar',
        roles: ['admin', 'manager'],
        order: 7,
        isActive: true
      },
      {
        name: 'Settings',
        path: '/dashboard/settings',
        icon: 'fas fa-cog',
        roles: ['admin'],
        order: 10,
        isActive: true
      }
    ]

    const createdMenus = await Menu.insertMany(initialMenus)
    console.log('Created menus:', createdMenus.length)

    // Create submenu with parent reference
    const reportsMenu = createdMenus.find(m => m.name === 'Reports')
    if (reportsMenu) {
      const subMenus = [
        {
          name: 'Menu Reports',
          path: '/dashboard/reports/menus',
          icon: 'fas fa-chart-pie',
          roles: ['admin', 'manager'],
          parent: reportsMenu._id,
          order: 1,
          isActive: true
        }
      ]
      
      const createdSubMenus = await Menu.insertMany(subMenus)
      console.log('Created sub-menus:', createdSubMenus.length)
    }

    const totalMenus = await Menu.countDocuments()

    return {
      success: true,
      message: 'Menu database seeded successfully',
      data: {
        totalMenus
      }
    }

  } catch (error: any) {
    console.error('Menu seed error:', error)
    
    // Handle MongoDB connection errors
    if (error.message?.includes('ECONNREFUSED') || error.message?.includes('MongoNetworkError')) {
      throw createError({
        statusCode: 503,
        statusMessage: 'Database connection failed'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to seed menu database'
    })
  }
})