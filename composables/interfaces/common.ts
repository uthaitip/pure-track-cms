export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginationOptions {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface MenuItem {
  _id: string
  name: string
  path: string
  icon?: string
  roles: string[]
  parent?: string
  order: number
  isActive: boolean
  children: MenuItem[]
}

export interface DashboardStats {
  users: number
  products: number
  orders: number
  revenue: number
}