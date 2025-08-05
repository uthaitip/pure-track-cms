// Simple in-memory storage for menus during development
// In production, this would be replaced with a real database

interface MenuItem {
  _id: string
  name: string
  path: string
  icon?: string
  roles: string[]
  parent?: string
  order: number
  isActive: boolean
  children: MenuItem[]
  createdAt?: string
  updatedAt?: string
}

// Initial mock menus data
const initialMenus: MenuItem[] = [
  {
    _id: '1',
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'fas fa-home',
    roles: ['admin', 'hr', 'manager', 'user'],
    order: 1,
    isActive: true,
    children: []
  },
  {
    _id: '2',  
    name: 'Admin Panel',
    path: '/dashboard/admin',
    icon: 'fas fa-cogs',
    roles: ['admin'],
    order: 2,
    isActive: true,
    children: []
  },
  {
    _id: '3',
    name: 'User Management',
    path: '/dashboard/users',
    icon: 'fas fa-users',
    roles: ['admin', 'hr'],
    order: 3,
    isActive: true,
    children: []
  },
  {
    _id: '4',
    name: 'Add User',
    path: '/dashboard/add-user',
    icon: 'fas fa-user-plus',
    roles: ['admin', 'hr'],
    order: 4,
    isActive: true,
    children: []
  },
  {
    _id: '5',
    name: 'Products',
    path: '/dashboard/products',
    icon: 'fas fa-box',
    roles: ['admin', 'manager'],
    order: 5,
    isActive: true,
    children: []
  },
  {
    _id: '6',
    name: 'Orders',
    path: '/dashboard/orders',
    icon: 'fas fa-shopping-cart',
    roles: ['admin', 'manager'],
    order: 6,
    isActive: true,
    children: []
  },
  {
    _id: '7',
    name: 'Reports',
    path: '/dashboard/reports',
    icon: 'fas fa-chart-bar',
    roles: ['admin', 'manager'],
    order: 7,
    isActive: true,
    children: []
  },
  {
    _id: '8',
    name: 'Menu Reports',
    path: '/dashboard/reports/menus',
    icon: 'fas fa-chart-pie',
    roles: ['admin', 'manager'],
    parent: '7',
    order: 1,
    isActive: true,
    children: []
  },
  {
    _id: '9',
    name: 'Stock Products',
    path: '/dashboard/products',
    icon: 'fas fa-boxes',
    roles: ['admin', 'manager', 'user'],
    order: 8,
    isActive: true,
    children: []
  },
  {
    _id: '10',
    name: 'Orders',
    path: '/dashboard/orders',
    icon: 'fas fa-shopping-cart',
    roles: ['admin', 'manager', 'user'],
    order: 9,
    isActive: true,
    children: []
  },
  {
    _id: '11',
    name: 'Settings',
    path: '/dashboard/settings',
    icon: 'fas fa-cog',
    roles: ['admin'],
    order: 10,
    isActive: true,
    children: []
  }
]

// In-memory storage
let menuStorage: MenuItem[] = [...initialMenus]

export class MenuStorage {
  static getAllMenus(): MenuItem[] {
    return menuStorage
  }

  static getMenuById(id: string): MenuItem | undefined {
    return menuStorage.find(menu => menu._id === id)
  }

  static getMenuByPath(path: string): MenuItem | undefined {
    return menuStorage.find(menu => menu.path === path)
  }

  static createMenu(menuData: Omit<MenuItem, '_id' | 'children'>): MenuItem {
    const newMenu: MenuItem = {
      ...menuData,
      _id: `menu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    menuStorage.push(newMenu)
    return newMenu
  }

  static updateMenu(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const index = menuStorage.findIndex(menu => menu._id === id)
    if (index === -1) return null

    menuStorage[index] = {
      ...menuStorage[index],
      ...updates,
      _id: id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    }

    return menuStorage[index]
  }

  static deleteMenu(id: string): boolean {
    const index = menuStorage.findIndex(menu => menu._id === id)
    if (index === -1) return false

    // Check if menu has children
    const hasChildren = menuStorage.some(menu => menu.parent === id)
    if (hasChildren) {
      throw new Error('Cannot delete menu with child items')
    }

    menuStorage.splice(index, 1)
    return true
  }

  static getMenusByRole(role: string): MenuItem[] {
    return menuStorage.filter(menu => 
      menu.roles.includes(role) && menu.isActive
    ).sort((a, b) => a.order - b.order)
  }

  static buildMenuTree(menus: MenuItem[]): MenuItem[] {
    const menuMap = new Map<string, MenuItem>()
    const rootMenus: MenuItem[] = []

    // Create a map of all menus
    menus.forEach(menu => {
      menuMap.set(menu._id, { ...menu, children: [] })
    })

    // Build the tree structure
    menus.forEach(menu => {
      const menuItem = menuMap.get(menu._id)!
      
      if (menu.parent) {
        const parent = menuMap.get(menu.parent)
        if (parent) {
          parent.children.push(menuItem)
        } else {
          // Parent not found, treat as root
          rootMenus.push(menuItem)
        }
      } else {
        rootMenus.push(menuItem)
      }
    })

    return rootMenus.sort((a, b) => a.order - b.order)
  }

  // Reset storage (useful for testing)
  static reset(): void {
    menuStorage = [...initialMenus]
  }
}