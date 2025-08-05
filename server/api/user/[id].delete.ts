import { authenticateToken } from '../../utils/auth'
import { User } from '../../models/User'
import { Role } from '../../models/Role'
import mongoose from 'mongoose'

export default defineEventHandler(async (event) => {
  try {
    // Authenticate and check permissions
    const decoded = await authenticateToken(event)
    
    // Check if user has permission to delete users
    if (!['admin'].includes(decoded.role)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Only administrators can delete users'
      })
    }

    // Get user ID from route parameters
    const userId = getRouterParam(event, 'id')
    
    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      })
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid user ID format'
      })
    }

    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cms-dev')
    }

    // Find the user to delete with role populated
    const userToDelete = await User.findById(userId)
      .populate('role')
      .lean()
    
    if (!userToDelete) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Prevent deleting own account
    if (decoded.userId === userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete your own account'
      })
    }

    // Prevent deleting the last admin (optional business rule)
    if ((userToDelete.role as any).name === 'admin') {
      const adminRole = await Role.findOne({ name: 'admin' })
      if (adminRole) {
        const adminCount = await User.countDocuments({ role: adminRole._id })
        if (adminCount <= 1) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Cannot delete the last administrator account'
          })
        }
      }
    }

    // Delete the user from database
    const deletedUser = await User.findByIdAndDelete(userId).lean()

    if (!deletedUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found or already deleted'
      })
    }

    return {
      success: true,
      message: `User ${userToDelete.firstName} ${userToDelete.lastName} deleted successfully`,
      data: {
        deletedUser: {
          _id: userToDelete._id,
          email: userToDelete.email,
          firstName: userToDelete.firstName,
          lastName: userToDelete.lastName
        }
      }
    }

  } catch (error: any) {
    console.error('Delete user error:', error)
    
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