import { connectDB } from '../utils/db'
import { Permission } from '../models/Permission'
import { Role } from '../models/Role'
import { User } from '../models/User'
import { Menu } from '../models/Menu'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()

    // Clear existing data
    await Promise.all([
      Permission.deleteMany({}),
      Role.deleteMany({}),
      User.deleteMany({}),
      Menu.deleteMany({})
    ])

    // Create permissions
    const permissions = await Permission.insertMany([
      { name: 'view_dashboard', description: 'View dashboard' },
      { name: 'view_users', description: 'View users list' },
      { name: 'create_user', description: 'Create new users' },
      { name: 'edit_user', description: 'Edit user information' },
      { name: 'delete_user', description: 'Delete users' },
      { name: 'view_reports', description: 'View reports' },
      { name: 'create_report', description: 'Create reports' },
      { name: 'manage_roles', description: 'Manage roles and permissions' },
      { name: 'manage_system', description: 'System administration' },
      { name: 'view_analytics', description: 'View analytics' },
      { name: 'manage_hr', description: 'HR management' },
      { name: 'manage_payroll', description: 'Payroll management' }
    ])

    const permissionMap = permissions.reduce((acc, perm) => {
      acc[perm.name] = perm._id
      return acc
    }, {} as Record<string, any>)

    // Create roles with permissions
    const roles = await Role.insertMany([
      {
        name: 'admin',
        description: 'Full system access',
        permissions: Object.values(permissionMap)
      },
      {
        name: 'hr',
        description: 'Human Resources management',
        permissions: [
          permissionMap.view_dashboard,
          permissionMap.view_users,
          permissionMap.create_user,
          permissionMap.edit_user,
          permissionMap.manage_hr,
          permissionMap.manage_payroll,
          permissionMap.view_reports
        ]
      },
      {
        name: 'accountant',
        description: 'Financial and accounting access',
        permissions: [
          permissionMap.view_dashboard,
          permissionMap.view_reports,
          permissionMap.create_report,
          permissionMap.view_analytics
        ]
      },
      {
        name: 'employee',
        description: 'Basic employee access',
        permissions: [
          permissionMap.view_dashboard
        ]
      }
    ])

    const roleMap = roles.reduce((acc, role) => {
      acc[role.name] = role._id
      return acc
    }, {} as Record<string, any>)

    // Create default admin user
    await User.create({
      email: 'admin@example.com',
      password: 'admin123',
      firstName: 'System',
      lastName: 'Administrator',
      role: roleMap.admin
    })

    // Create sample users for other roles
    await User.insertMany([
      {
        email: 'hr@example.com',
        password: 'password123',
        firstName: 'HR',
        lastName: 'Manager',
        role: roleMap.hr
      },
      {
        email: 'accountant@example.com',
        password: 'password123',
        firstName: 'Finance',
        lastName: 'Manager',
        role: roleMap.accountant
      },
      {
        email: 'employee@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Employee',
        role: roleMap.employee
      }
    ])

    // Create menus
    await Menu.insertMany([
      {
        name: 'Dashboard',
        path: '/dashboard',
        icon: 'fas fa-home',
        roles: ['admin', 'hr', 'accountant', 'employee'],
        order: 1
      },
      {
        name: 'Admin Panel',
        path: '/dashboard/admin',
        icon: 'fas fa-cogs',
        roles: ['admin'],
        order: 2
      },
      {
        name: 'User Management',
        path: '/dashboard/users',
        icon: 'fas fa-users',
        roles: ['admin', 'hr'],
        order: 3
      },
      {
        name: 'Reports',
        path: '/dashboard/reports',
        icon: 'fas fa-chart-bar',
        roles: ['admin', 'accountant', 'hr'],
        order: 4
      },
      {
        name: 'HR Management',
        path: '/dashboard/hr',
        icon: 'fas fa-user-tie',
        roles: ['admin', 'hr'],
        order: 5
      },
      {
        name: 'Settings',
        path: '/dashboard/settings',
        icon: 'fas fa-cog',
        roles: ['admin', 'hr', 'accountant', 'employee'],
        order: 6
      }
    ])

    return {
      success: true,
      message: 'Database seeded successfully',
      data: {
        permissions: permissions.length,
        roles: roles.length,
        users: 4,
        menus: 6
      }
    }

  } catch (error: any) {
    console.error('Seed error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to seed database'
    })
  }
})