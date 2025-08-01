import { authenticateToken } from '../../utils/auth'

// Mock menus data
const mockMenus = [
  {
    _id: '1',
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'fas fa-home',
    roles: ['admin', 'hr', 'accountant', 'employee'],
    order: 1,
    isActive: true,
    children: []
  },
  {
    _id: '2',  
    name: 'Admin Panel',
    path: '/dashboard/admin',
    icon: 'fas fa-cogs',
    roles: ['admin'],
    order: 2,
    isActive: true,
    children: []
  },
  {
    _id: '3',
    name: 'User Management',
    path: '/dashboard/users',
    icon: 'fas fa-users',
    roles: ['admin', 'hr'],
    order: 3,
    isActive: true,
    children: []
  },
  {
    _id: '7',
    name: 'Add User',
    path: '/dashboard/add-user',
    icon: 'fas fa-user-plus',
    roles: ['admin', 'hr'],
    order: 3.5,
    isActive: true,
    children: []
  },
  {
    _id: '4',
    name: 'Reports',
    path: '/dashboard/reports',
    icon: 'fas fa-chart-bar',
    roles: ['admin', 'accountant', 'hr'],
    order: 4,
    isActive: true,
    children: []
  },
  {
    _id: '5',
    name: 'HR Management',
    path: '/dashboard/hr',
    icon: 'fas fa-user-tie',
    roles: ['admin', 'hr'],
    order: 5,
    isActive: true,
    children: []
  },
  {
    _id: '6',
    name: 'Settings',
    path: '/dashboard/settings',
    icon: 'fas fa-cog',
    roles: ['admin', 'hr', 'accountant', 'employee'],
    order: 6,
    isActive: true,
    children: []
  }
]

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

    // Filter menus based on user role
    const userMenus = mockMenus.filter(menu => 
      menu.roles.includes(userRole) && menu.isActive
    ).sort((a, b) => a.order - b.order)

    return {
      success: true,
      message: 'Menus retrieved successfully',
      data: {
        menus: userMenus
      }
    }

  } catch (error: any) {
    console.error('Get menus error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})