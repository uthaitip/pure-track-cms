import mongoose from 'mongoose'

export interface IMenu {
  _id?: string
  name: string
  path: string
  icon?: string
  roles: ('admin' | 'employee' | 'accountant' | 'hr' | 'manager')[]
  parent?: mongoose.Schema.Types.ObjectId
  order: number
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

const menuSchema = new mongoose.Schema<IMenu>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  path: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  roles: [{
    type: String,
    enum: ['admin', 'employee', 'accountant', 'hr', 'manager'],
    required: true
  }],
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Index for efficient querying
menuSchema.index({ roles: 1, isActive: 1, order: 1 })

export const Menu = mongoose.models.Menu || mongoose.model<IMenu>('Menu', menuSchema)