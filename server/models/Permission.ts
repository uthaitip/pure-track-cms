import mongoose from 'mongoose'

export interface IPermission {
  _id?: string
  name: string
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

const permissionSchema = new mongoose.Schema<IPermission>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

export const Permission = mongoose.models.Permission || mongoose.model<IPermission>('Permission', permissionSchema)