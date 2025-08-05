import type { ProductStatus } from '../constants/status'

export interface Product {
  _id: string
  name: string
  description?: string
  sku: string
  category: string
  price: number
  costPrice: number
  stock: number
  minStock: number
  maxStock: number
  unit: string
  barcode?: string
  image?: string
  status: ProductStatus
  supplier?: {
    _id: string
    name: string
    contact?: string
  }
  location?: {
    warehouse: string
    aisle?: string
    shelf?: string
  }
  tags: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy?: string
}

export interface CreateProductData {
  name: string
  description?: string
  sku: string
  category: string
  price: number
  costPrice: number
  stock: number
  minStock: number
  maxStock: number
  unit: string
  barcode?: string
  image?: string
  status?: ProductStatus
  supplier?: {
    _id: string
    name: string
    contact?: string
  }
  location?: {
    warehouse: string
    aisle?: string
    shelf?: string
  }
  tags?: string[]
  isActive?: boolean
}

export interface UpdateProductData {
  name?: string
  description?: string
  sku?: string
  category?: string
  price?: number
  costPrice?: number
  stock?: number
  minStock?: number
  maxStock?: number
  unit?: string
  barcode?: string
  image?: string
  status?: ProductStatus
  supplier?: {
    _id: string
    name: string
    contact?: string
  }
  location?: {
    warehouse: string
    aisle?: string
    shelf?: string
  }
  tags?: string[]
  isActive?: boolean
}

export interface ProductFilter {
  search?: string
  category?: string
  status?: ProductStatus
  supplier?: string
  lowStock?: boolean
  isActive?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface StockMovement {
  _id: string
  productId: string
  type: 'in' | 'out' | 'adjustment'
  quantity: number
  previousStock: number
  newStock: number
  reason: string
  reference?: string
  createdAt: string
  createdBy: string
}

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food & Beverages',
  'Health & Beauty',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Toys & Games',
  'Automotive',
  'Office Supplies',
  'Other'
] as const

export const PRODUCT_UNITS = [
  'piece',
  'kg',
  'g',
  'liter',
  'ml',
  'meter',
  'cm',
  'box',
  'pack',
  'bottle',
  'bag',
  'set'
] as const

export const PRODUCT_STATUSES = [
  'active',
  'inactive', 
  'discontinued',
  'out_of_stock'
] as const