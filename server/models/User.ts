import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { IRole } from './Role'

export interface IUser {
  _id?: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: mongoose.Types.ObjectId | IRole
  isActive: boolean
  lastLogin?: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>
  getFullName(): string
}

const userSchema = new mongoose.Schema<IUser, {}, IUserMethods>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Get full name method
userSchema.methods.getFullName = function(): string {
  return `${this.firstName} ${this.lastName}`
}

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject()
  delete userObject.password
  return userObject
}

export const User = mongoose.models.User || mongoose.model<IUser, {}, IUserMethods>('User', userSchema)