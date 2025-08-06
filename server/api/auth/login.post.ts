import { signJWT } from '../../utils/jwt'
import { connectDB } from '../../utils/db'
import { User } from '../../models/User'
import { Permission } from '../../models/Permission'
import { Role } from '../../models/Role'

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event)

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }

    // Connect to MongoDB
    await connectDB()

    // Find user in database
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).populate({
      path: 'role',
      populate: {
        path: 'permissions',
        model: 'Permission'
      }
    }).lean()
    
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

    // Check password using the User model method
    const userDoc = await User.findById(user._id)
    const isPasswordValid = await userDoc?.comparePassword(password)
    
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() })

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
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
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

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation error: ' + error.message
      })
    }

    // Handle MongoServerError
    if (error.name === 'MongoServerError') {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database error: ' + error.message
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})