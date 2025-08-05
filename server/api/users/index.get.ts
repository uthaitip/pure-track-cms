import { authenticateToken } from '../../utils/auth'
import { User } from '../../models/User'
import { Role } from '../../models/Role'
import { Permission } from '../../models/Permission'
import mongoose from 'mongoose'

export default defineEventHandler(async (event) => {
  try {
    // Authenticate and check permissions
    const decoded = await authenticateToken(event)
    
    // Check if user has permission to view users
    if (!['admin', 'hr'].includes(decoded.role)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Insufficient permissions to view users'
      })
    }

    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cms-dev')
    }

    // Get query parameters for filtering/pagination
    const query = getQuery(event)
    const { role, isActive, page = 1, limit = 50, search } = query

    // Build MongoDB query
    const mongoQuery: any = {}

    // Filter by role if specified
    if (role && typeof role === 'string') {
      const roleDoc = await Role.findOne({ name: role.toLowerCase() })
      if (roleDoc) {
        mongoQuery.role = roleDoc._id
      }
    }

    // Filter by active status if specified
    if (isActive !== undefined) {
      mongoQuery.isActive = isActive === 'true' || isActive === true
    }

    // Search by name or email if specified
    if (search && typeof search === 'string') {
      mongoQuery.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    // Pagination
    const pageNum = parseInt(page as string) || 1
    const limitNum = parseInt(limit as string) || 50
    const skip = (pageNum - 1) * limitNum

    // Fetch users with populated role and permissions
    const users = await User.find(mongoQuery)
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
          model: 'Permission'
        }
      })
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limitNum)
      .lean() // Convert to plain JavaScript objects

    // Get total count for pagination
    const total = await User.countDocuments(mongoQuery)

    return {
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    }

  } catch (error: any) {
    console.error('Get users error:', error)
    
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