import jwt from 'jsonwebtoken'
import type { IUser } from '../models/User'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export const signJWT = (user: IUser): string => {
  const config = useRuntimeConfig()
  const jwtSecret = config.jwtSecret || process.env.JWT_SECRET || 'fallback-secret'
  const jwtExpiresIn = config.jwtExpiresIn || process.env.JWT_EXPIRES_IN || '7d'
  
  const payload: JWTPayload = {
    userId: user._id!.toString(),
    email: user.email,
    role: typeof user.role === 'object' ? user.role.name : user.role.toString()
  }

  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiresIn
  })
}

export const verifyJWT = (token: string): JWTPayload => {
  const config = useRuntimeConfig()
  const jwtSecret = config.jwtSecret || process.env.JWT_SECRET || 'fallback-secret'
  
  try {
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload
    return decoded
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  return authHeader.substring(7)
}