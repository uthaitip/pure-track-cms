import { authenticateToken } from '../../utils/auth'
import { User } from '../../models/User'
import { Role } from '../../models/Role'
import { Permission } from '../../models/Permission'
import mongoose from 'mongoose'

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

    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cms-dev')
    }

    // Check if email already exists
    const existingUser = await User.findOne({ 
      email: email.toLowerCase() 
    }).lean()
    
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User with this email already exists'
      })
    }

    // Find the role document
    const roleDoc = await Role.findOne({ name: roleName }).populate('permissions').lean()
    if (!roleDoc) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid role specified'
      })
    }

    // Create new user in database
    const newUser = new User({
      email: email.toLowerCase(),
      password, // Will be hashed by pre-save middleware
      firstName,
      lastName,
      role: roleDoc._id,
      isActive
    })

    const savedUser = await newUser.save()

    // Populate the role and permissions for response
    const populatedUser = await User.findById(savedUser._id)
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
          model: 'Permission'
        }
      })
      .select('-password')
      .lean()

    return {
      success: true,
      message: 'User created successfully',
      data: {
        user: populatedUser
      }
    }

  } catch (error: any) {
    console.error('Create user error:', error)
    
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