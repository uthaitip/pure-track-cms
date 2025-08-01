import { signJWT } from '../../utils/jwt'

// Mock user data for testing (replace with database when DB is working)
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

const validCredentials = {
  'admin@example.com': 'admin123',
  'hr@example.com': 'password123',
  'accountant@example.com': 'password123',
  'employee@example.com': 'password123'
}

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event)

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }

    // Find mock user
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Check if user is active
    if (!user.isActive) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Account is deactivated'  
      })
    }

    // Check password
    if (validCredentials[email as keyof typeof validCredentials] !== password) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Generate JWT token
    const token = signJWT(user as any)

    return {
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    }

  } catch (error: any) {
    console.error('Login error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})