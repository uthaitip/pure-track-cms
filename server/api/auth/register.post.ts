import { connectDB } from '../../utils/db'
import { User } from '../../models/User'
import { Role } from '../../models/Role'
import { Permission } from '../../models/Permission'
import { signJWT } from '../../utils/jwt'

interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  roleName?: 'admin' | 'employee' | 'accountant' | 'hr' | 'manager'
}

export default defineEventHandler(async (event) => {
  try {
    const { email, password, firstName, lastName, roleName = 'employee' }: RegisterRequest = await readBody(event)

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email, password, first name, and last name are required'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Please provide a valid email address'
      })
    }

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 6 characters long'
      })
    }

    // Connect to database
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User with this email already exists'
      })
    }

    // Find role
    const role = await Role.findOne({ name: roleName }).populate('permissions')
    if (!role) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid role specified'
      })
    }

    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      role: role._id
    })

    await newUser.save()

    // Populate role for response
    await newUser.populate({
      path: 'role',
      populate: {
        path: 'permissions'
      }
    })

    // Generate JWT token
    const token = signJWT(newUser)

    return {
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser.toJSON(),
        token
      }
    }

  } catch (error: any) {
    console.error('Registration error:', error)
    
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

    // Handle duplicate key errors (unique constraints)
    if (error.code === 11000) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User with this email already exists'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})