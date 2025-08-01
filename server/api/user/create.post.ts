import { authenticateToken } from '../../utils/auth'

// Mock users storage (same as in other files)
let mockUsers = [
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
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
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
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
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
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
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
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  }
]

// Available roles with permissions
const availableRoles = {
  admin: {
    name: 'admin',
    permissions: [
      { name: 'view_dashboard' },
      { name: 'manage_users' },
      { name: 'manage_system' },
      { name: 'view_reports' },
      { name: 'manage_roles' }
    ]
  },
  hr: {
    name: 'hr',
    permissions: [
      { name: 'view_dashboard' },
      { name: 'manage_hr' },
      { name: 'view_users' },
      { name: 'create_user' }
    ]
  },
  accountant: {
    name: 'accountant',
    permissions: [
      { name: 'view_dashboard' },
      { name: 'view_reports' },
      { name: 'view_analytics' }
    ]
  },
  employee: {
    name: 'employee',
    permissions: [
      { name: 'view_dashboard' }
    ]
  }
}

interface CreateUserRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  roleName: 'admin' | 'employee' | 'accountant' | 'hr'
  isActive?: boolean
}

export default defineEventHandler(async (event) => {
  try {
    // Authenticate and check permissions
    const decoded = await authenticateToken(event)
    
    // Check if user has permission to create users
    if (!['admin', 'hr'].includes(decoded.role)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Insufficient permissions to create users'
      })
    }

    const { email, password, firstName, lastName, roleName, isActive = true }: CreateUserRequest = await readBody(event)

    // Validate input
    if (!email || !password || !firstName || !lastName || !roleName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'All fields are required'
      })
    }

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 6 characters long'
      })
    }

    // Check if email already exists
    const existingUser = mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User with this email already exists'
      })
    }

    // Validate role
    if (!availableRoles[roleName]) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid role specified'
      })
    }

    // Generate new user ID
    const newUserId = '64a1b1234567890123' + (Date.now().toString().slice(-6))

    // Create new user
    const newUser = {
      _id: newUserId,
      email: email.toLowerCase(),
      firstName,
      lastName,
      role: availableRoles[roleName],
      isActive,
      createdAt: new Date().toISOString()
    }

    // Add to mock users array
    mockUsers.push(newUser)

    return {
      success: true,
      message: 'User created successfully',
      data: {
        user: newUser
      }
    }

  } catch (error: any) {
    console.error('Create user error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})