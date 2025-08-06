import type { H3Event } from 'h3'
import { verifyJWT, extractTokenFromHeader, type JWTPayload } from './jwt'
import { User } from '../models/User'
import { Role } from '../models/Role'
import { Permission } from '../models/Permission'
import { connectDB } from './db'

export interface AuthenticatedUser extends JWTPayload {
  user?: any
}

export const authenticateToken = async (event: H3Event): Promise<AuthenticatedUser> => {
  const authHeader = getHeader(event, 'authorization')
  const token = extractTokenFromHeader(authHeader)
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Access token required'
    })
  }

  try {
    const decoded = verifyJWT(token)
    return decoded
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid access token'
    })
  }
}

export const authenticateAndGetUser = async (event: H3Event): Promise<AuthenticatedUser & { user: any }> => {
  const decoded = await authenticateToken(event)
  
  try {
    await connectDB()
    const user = await User.findById(decoded.userId)
      .populate('role')
      .select('-password')
    
    if (!user || !user.isActive) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found or inactive'
      })
    }

    return { ...decoded, user }
  } catch (error: any) {
    if (error.statusCode) throw error
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to authenticate user'
    })
  }
}

export const requirePermission = (requiredPermission: string) => {
  return async (event: H3Event) => {
    const { user } = await authenticateAndGetUser(event)
    
    const userPermissions = user.role?.permissions || []
    const hasPermission = userPermissions.some((permission: any) => 
      permission.name === requiredPermission
    )
    
    if (!hasPermission) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Insufficient permissions'
      })
    }
    
    return { user }
  }
}

export const requireRole = (requiredRoles: string | string[]) => {
  return async (event: H3Event) => {
    const { user } = await authenticateAndGetUser(event)
    
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
    const userRole = user.role?.name
    
    if (!roles.includes(userRole)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Insufficient role access'
      })
    }
    
    return { user }
  }
}