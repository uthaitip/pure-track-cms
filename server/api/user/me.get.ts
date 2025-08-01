import { authenticateToken } from '../../utils/auth'

// Same mock users as in login
const mockUsers = [
  {
    _id: '64a1b1234567890123456789',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: {
      name: 'admin',
      permissions: [
        { name: 'view_dashboard' },
        { name: 'manage_users' },
        { name: 'manage_system' },
        { name: 'view_reports' },
        { name: 'manage_roles' }
      ]
    },
    isActive: true
  },
  {
    _id: '64a1b1234567890123456790',
    email: 'hr@example.com',
    firstName: 'HR',
    lastName: 'Manager',
    role: {
      name: 'hr',
      permissions: [
        { name: 'view_dashboard' },
        { name: 'manage_hr' },
        { name: 'view_users' },
        { name: 'create_user' }
      ]
    },
    isActive: true
  },
  {
    _id: '64a1b1234567890123456791',
    email: 'accountant@example.com',
    firstName: 'Finance',
    lastName: 'Manager',
    role: {
      name: 'accountant',
      permissions: [
        { name: 'view_dashboard' },
        { name: 'view_reports' },
        { name: 'view_analytics' }
      ]
    },
    isActive: true
  },
  {
    _id: '64a1b1234567890123456792',
    email: 'employee@example.com',
    firstName: 'John',
    lastName: 'Employee',
    role: {
      name: 'employee',
      permissions: [
        { name: 'view_dashboard' }
      ]
    },
    isActive: true
  }
]

export default defineEventHandler(async (event) => {
  try {
    const decoded = await authenticateToken(event)
    
    // Find user by ID from token
    const user = mockUsers.find(u => u._id === decoded.userId)
    
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    return {
      success: true,
      message: 'User data retrieved successfully',
      data: {
        user
      }
    }

  } catch (error: any) {
    console.error('Get user error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})