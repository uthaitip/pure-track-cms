import type { UserRole, UserStatus } from '../constants/status'

export interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: {
    _id: string
    name: UserRole
    permissions: Permission[]
  }
  isActive: boolean
  status: UserStatus
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface Permission {
  _id: string
  name: string
  description?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  roleName: UserRole
}

export interface CreateUserData {
  email: string
  firstName: string
  lastName: string
  role: string
  isActive?: boolean
}

export interface UpdateUserData {
  email?: string
  firstName?: string
  lastName?: string
  role?: string
  isActive?: boolean
}