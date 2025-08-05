import { authenticateToken } from '../../utils/auth'
import { MenuStorage } from '../../utils/menuStorage'

export default defineEventHandler(async (event) => {
  try {
    const decoded = await authenticateToken(event)
    const userRole = decoded.role

    if (!userRole) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User role not found'
      })
    }

    // Get query parameters for filtering
    const query = getQuery(event)
    const startDate = query.startDate ? new Date(query.startDate as string) : null
    const endDate = query.endDate ? new Date(query.endDate as string) : null

    // Get all menus
    const allMenus = MenuStorage.getAllMenus()

    // Filter by date if provided
    let filteredMenus = allMenus
    if (startDate || endDate) {
      filteredMenus = allMenus.filter(menu => {
        const createdAt = menu.createdAt ? new Date(menu.createdAt) : new Date()
        
        if (startDate && createdAt < startDate) return false
        if (endDate && createdAt > endDate) return false
        
        return true
      })
    }

    // Calculate statistics
    const totalMenus = filteredMenus.length
    const activeMenus = filteredMenus.filter(menu => menu.isActive).length
    const inactiveMenus = totalMenus - activeMenus

    // Group by roles
    const roleStats = filteredMenus.reduce((acc, menu) => {
      menu.roles.forEach(role => {
        if (!acc[role]) {
          acc[role] = { total: 0, active: 0, inactive: 0 }
        }
        acc[role].total++
        if (menu.isActive) {
          acc[role].active++
        } else {
          acc[role].inactive++
        }
      })
      return acc
    }, {} as Record<string, { total: number; active: number; inactive: number }>)

    // Group by creation date (monthly)
    const monthlyStats = filteredMenus.reduce((acc, menu) => {
      const date = menu.createdAt ? new Date(menu.createdAt) : new Date()
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!acc[monthKey]) {
        acc[monthKey] = { total: 0, active: 0, inactive: 0 }
      }
      
      acc[monthKey].total++
      if (menu.isActive) {
        acc[monthKey].active++
      } else {
        acc[monthKey].inactive++
      }
      
      return acc
    }, {} as Record<string, { total: number; active: number; inactive: number }>)

    // Most recent menus
    const recentMenus = [...filteredMenus]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0)
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0)
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, 10)

    // Parent/child relationships
    const parentMenus = filteredMenus.filter(menu => !menu.parent)
    const childMenus = filteredMenus.filter(menu => menu.parent)

    return {
      success: true,
      message: 'Menu reports retrieved successfully',
      data: {
        summary: {
          totalMenus,
          activeMenus,
          inactiveMenus,
          parentMenus: parentMenus.length,
          childMenus: childMenus.length
        },
        roleStats,
        monthlyStats,
        recentMenus: recentMenus.map(menu => ({
          _id: menu._id,
          name: menu.name,
          path: menu.path,
          isActive: menu.isActive,
          roles: menu.roles,
          createdAt: menu.createdAt,
          updatedAt: menu.updatedAt
        })),
        allMenus: filteredMenus.map(menu => ({
          _id: menu._id,
          name: menu.name,
          path: menu.path,
          icon: menu.icon,
          roles: menu.roles,
          parent: menu.parent,
          order: menu.order,
          isActive: menu.isActive,
          createdAt: menu.createdAt,
          updatedAt: menu.updatedAt
        })),
        filters: {
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString()
        }
      }
    }

  } catch (error: any) {
    console.error('Get menu reports error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})