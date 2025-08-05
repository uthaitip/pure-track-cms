export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending'
} as const

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out-of-stock'
} as const

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  HR: 'hr',
  ACCOUNTANT: 'accountant',
  EMPLOYEE: 'employee'
} as const

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS]
export type ProductStatus = typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS]
export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS]
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]