import mongoose from 'mongoose'
import { IPermission } from './Permission'

export interface IRole {
  _id?: string
  name: 'admin' | 'employee' | 'accountant' | 'hr'
  description?: string
  permissions: mongoose.Types.ObjectId[] | IPermission[]
  createdAt?: Date
  updatedAt?: Date
}

const roleSchema = new mongoose.Schema<IRole>({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['admin', 'employee', 'accountant', 'hr']
  },
  description: {
    type: String,
    trim: true
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }]
}, {
  timestamps: true
})

export const Role = mongoose.models.Role || mongoose.model<IRole>('Role', roleSchema)