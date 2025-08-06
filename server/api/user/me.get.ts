import { authenticateToken } from '../../utils/auth'
import { connectDB } from '../../utils/db'
import { User } from '../../models/User'
import { Role } from '../../models/Role'
import { Permission } from '../../models/Permission'

export default defineEventHandler(async (event) => {
  try {
    const decoded = await authenticateToken(event)
    
    // Connect to MongoDB
    await connectDB()
    
    // Find user by ID from token with populated role and permissions
    const user = await User.findById(decoded.userId)
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
          model: 'Permission'
        }
      })
      .select('-password')
      .lean()
    
    if (!user || !user.isActive) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found or inactive'
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
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})