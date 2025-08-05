export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const search = query.search as string || ''
    const role = query.role as string || ''

    // Mock users data - In real app, this would be from database
    const mockUsers = [
      {
        _id: 'user_1',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: { _id: 'role_admin', name: 'admin' },
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'user_2',
        email: 'hr@example.com',
        firstName: 'HR',
        lastName: 'Manager',
        role: { _id: 'role_hr', name: 'hr' },
        status: 'active',
        lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'user_3',
        email: 'manager@example.com',
        firstName: 'Store',
        lastName: 'Manager',
        role: { _id: 'role_manager', name: 'manager' },
        status: 'active',
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'user_4',
        email: 'user@example.com',
        firstName: 'Regular',
        lastName: 'User',
        role: { _id: 'role_user', name: 'user' },
        status: 'active',
        lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'user_5',
        email: 'inactive@example.com',
        firstName: 'Inactive',
        lastName: 'User',
        role: { _id: 'role_user', name: 'user' },
        status: 'inactive',
        lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    // Apply filters
    let filteredUsers = mockUsers

    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = filteredUsers.filter(user => 
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      )
    }

    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role.name === role)
    }

    // Apply pagination
    const total = filteredUsers.length
    const pages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return {
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          total,
          pages
        }
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch users'
    })
  }
})