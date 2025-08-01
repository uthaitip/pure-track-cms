import { connectDB } from '../../utils/db'
import { User } from '../../models/User'
import { Role } from '../../models/Role'
import { signJWT } from '../../utils/jwt'

interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  roleName: 'admin' | 'employee' | 'accountant' | 'hr'
}

export default defineEventHandler(async (event) => {
  try {
    const { email, password, firstName, lastName, roleName }: RegisterRequest = await readBody(event)

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
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})