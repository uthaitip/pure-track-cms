import { User } from '../../models/User'
import { Role } from '../../models/Role'
import { Permission } from '../../models/Permission'
import mongoose from 'mongoose'

export default defineEventHandler(async (event) => {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cms-dev')
    }

    // Clear existing data
    await User.deleteMany({})
    await Role.deleteMany({})
    await Permission.deleteMany({})

    // Create permissions
    const permissions = [
      { name: 'view_dashboard', description: 'View dashboard' },
      { name: 'manage_users', description: 'Manage users' },
      { name: 'manage_system', description: 'Manage system settings' },
      { name: 'view_reports', description: 'View reports' },
      { name: 'manage_roles', description: 'Manage roles and permissions' },
      { name: 'manage_hr', description: 'Manage HR operations' },
      { name: 'view_users', description: 'View users list' },
      { name: 'create_user', description: 'Create new users' },
      { name: 'view_analytics', description: 'View analytics' }
    ]

    const createdPermissions = await Permission.insertMany(permissions)
    console.log('Created permissions:', createdPermissions.length)

    // Create roles with permissions
    const roles = [
      {
        name: 'admin',
        description: 'Administrator with full access',
        permissions: createdPermissions.map(p => p._id)
      },
      {
        name: 'hr',
        description: 'HR Manager',
        permissions: createdPermissions.filter(p => 
          ['view_dashboard', 'manage_hr', 'view_users', 'create_user'].includes(p.name)
        ).map(p => p._id)
      },
      {
        name: 'accountant',
        description: 'Accountant',
        permissions: createdPermissions.filter(p => 
          ['view_dashboard', 'view_reports', 'view_analytics'].includes(p.name)
        ).map(p => p._id)
      },
      {
        name: 'employee',
        description: 'Regular Employee',
        permissions: createdPermissions.filter(p => 
          ['view_dashboard'].includes(p.name)
        ).map(p => p._id)
      }
    ]

    const createdRoles = await Role.insertMany(roles)
    console.log('Created roles:', createdRoles.length)

    // Create users
    const users = [
      {
        email: 'admin@example.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: createdRoles.find(r => r.name === 'admin')?._id,
        isActive: true
      },
      {
        email: 'hr@example.com',
        password: 'password123',
        firstName: 'HR',
        lastName: 'Manager',
        role: createdRoles.find(r => r.name === 'hr')?._id,
        isActive: true
      },
      {
        email: 'accountant@example.com',
        password: 'password123',
        firstName: 'Finance',
        lastName: 'Manager',
        role: createdRoles.find(r => r.name === 'accountant')?._id,
        isActive: true
      },
      {
        email: 'employee@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Employee',
        role: createdRoles.find(r => r.name === 'employee')?._id,
        isActive: true
      }
    ]

    const createdUsers = await User.insertMany(users)
    console.log('Created users:', createdUsers.length)

    return {
      success: true,
      message: 'Database seeded successfully',
      data: {
        permissions: createdPermissions.length,
        roles: createdRoles.length,
        users: createdUsers.length
      }
    }

  } catch (error: any) {
    console.error('Seed error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to seed database'
    })
  }
})