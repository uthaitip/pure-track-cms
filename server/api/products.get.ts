import { authenticateToken } from '../utils/auth'
import type { Product, ProductFilter } from '~/composables/interfaces/product'

// Mock products data - In production, this would be from database
const mockProducts: Product[] = [
  {
    _id: 'prod_1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    sku: 'WH-001',
    category: 'Electronics',
    price: 99.99,
    costPrice: 60.00,
    stock: 25,
    minStock: 5,
    maxStock: 100,
    unit: 'piece',
    barcode: '1234567890123',
    image: '/images/headphones.jpg',
    status: 'active',
    supplier: {
      _id: 'sup_1',
      name: 'Tech Supplies Co.',
      contact: 'contact@techsupplies.com'
    },
    location: {
      warehouse: 'Main',
      aisle: 'A1',
      shelf: 'S3'
    },
    tags: ['wireless', 'audio', 'electronics'],
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user_1',
    updatedBy: 'user_1'
  },
  {
    _id: 'prod_2',
    name: 'Cotton T-Shirt',
    description: '100% cotton comfortable t-shirt available in multiple colors',
    sku: 'TS-002',
    category: 'Clothing',
    price: 19.99,
    costPrice: 12.00,
    stock: 150,
    minStock: 20,
    maxStock: 500,
    unit: 'piece',
    barcode: '2345678901234',
    status: 'active',
    supplier: {
      _id: 'sup_2',
      name: 'Fashion Wholesale',
      contact: 'orders@fashionwholesale.com'
    },
    location: {
      warehouse: 'Main',
      aisle: 'B2',
      shelf: 'S1'
    },
    tags: ['clothing', 'cotton', 'casual'],
    isActive: true,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user_2',
    updatedBy: 'user_2'
  },
  {
    _id: 'prod_3',
    name: 'Organic Green Tea',
    description: 'Premium organic green tea, 100g pack',
    sku: 'GT-003',
    category: 'Food & Beverages',
    price: 15.50,
    costPrice: 8.00,
    stock: 3,
    minStock: 10,
    maxStock: 200,
    unit: 'pack',
    barcode: '3456789012345',
    status: 'active',
    supplier: {
      _id: 'sup_3',
      name: 'Organic Foods Ltd.',
      contact: 'sales@organicfoods.com'
    },
    location: {
      warehouse: 'Cold Storage',
      aisle: 'C1',
      shelf: 'S2'
    },
    tags: ['organic', 'tea', 'beverage'],
    isActive: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user_1',
    updatedBy: 'user_1'
  },
  {
    _id: 'prod_4',
    name: 'Office Chair',
    description: 'Ergonomic office chair with lumbar support',
    sku: 'OC-004',
    category: 'Office Supplies',
    price: 199.99,
    costPrice: 120.00,
    stock: 12,
    minStock: 5,
    maxStock: 50,
    unit: 'piece',
    barcode: '4567890123456',
    status: 'active',
    supplier: {
      _id: 'sup_4',
      name: 'Office Furniture Pro',
      contact: 'info@officefurniture.com'
    },
    location: {
      warehouse: 'Warehouse B',
      aisle: 'D1',
      shelf: 'Floor'
    },
    tags: ['furniture', 'office', 'ergonomic'],
    isActive: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user_3',
    updatedBy: 'user_3'
  },
  {
    _id: 'prod_5',
    name: 'Smartphone Case',
    description: 'Protective case for smartphones, transparent design',
    sku: 'SC-005',
    category: 'Electronics',
    price: 12.99,
    costPrice: 6.00,
    stock: 0,
    minStock: 15,
    maxStock: 300,
    unit: 'piece',
    barcode: '5678901234567',
    status: 'out_of_stock',
    supplier: {
      _id: 'sup_1',
      name: 'Tech Supplies Co.',
      contact: 'contact@techsupplies.com'
    },
    location: {
      warehouse: 'Main',
      aisle: 'A2',
      shelf: 'S1'
    },
    tags: ['phone', 'accessory', 'protection'],
    isActive: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user_2',
    updatedBy: 'user_2'
  },
  {
    _id: 'prod_6',
    name: 'Gaming Mouse',
    description: 'High-precision gaming mouse with RGB lighting',
    sku: 'GM-006',
    category: 'Electronics',
    price: 79.99,
    costPrice: 45.00,
    stock: 35,
    minStock: 10,
    maxStock: 150,
    unit: 'piece',
    barcode: '6789012345678',
    status: 'active',
    supplier: {
      _id: 'sup_1',
      name: 'Tech Supplies Co.',
      contact: 'contact@techsupplies.com'
    },
    location: {
      warehouse: 'Main',
      aisle: 'A1',
      shelf: 'S2'
    },
    tags: ['gaming', 'mouse', 'rgb', 'electronics'],
    isActive: true,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user_1',
    updatedBy: 'user_1'
  },
  {
    _id: 'prod_7',
    name: 'Protein Powder',
    description: 'Whey protein powder for muscle building, vanilla flavor, 2kg',
    sku: 'PP-007',
    category: 'Health & Beauty',
    price: 45.99,
    costPrice: 28.00,
    stock: 2,
    minStock: 8,
    maxStock: 80,
    unit: 'kg',
    barcode: '7890123456789',
    status: 'active',
    supplier: {
      _id: 'sup_5',
      name: 'Health Nutrition Ltd.',
      contact: 'orders@healthnutrition.com'
    },
    location: {
      warehouse: 'Main',
      aisle: 'E1',
      shelf: 'S4'
    },
    tags: ['protein', 'fitness', 'supplement', 'vanilla'],
    isActive: true,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user_2',
    updatedBy: 'user_2'
  },
  {
    _id: 'prod_8',
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness and USB charging port',
    sku: 'DL-008',
    category: 'Office Supplies',
    price: 34.99,
    costPrice: 20.00,
    stock: 18,
    minStock: 5,
    maxStock: 60,
    unit: 'piece',
    barcode: '8901234567890',
    status: 'active',
    supplier: {
      _id: 'sup_4',
      name: 'Office Furniture Pro',
      contact: 'info@officefurniture.com'
    },
    location: {
      warehouse: 'Warehouse B',
      aisle: 'D2',
      shelf: 'S3'
    },
    tags: ['lamp', 'led', 'office', 'usb'],
    isActive: true,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user_3',
    updatedBy: 'user_3'
  },
  {
    _id: 'prod_9',
    name: 'Winter Jacket',
    description: 'Waterproof winter jacket with thermal lining, size M',
    sku: 'WJ-009',
    category: 'Clothing',
    price: 89.99,
    costPrice: 55.00,
    stock: 8,
    minStock: 3,
    maxStock: 40,
    unit: 'piece',
    barcode: '9012345678901',
    status: 'active',
    supplier: {
      _id: 'sup_2',
      name: 'Fashion Wholesale',
      contact: 'orders@fashionwholesale.com'
    },
    location: {
      warehouse: 'Main',
      aisle: 'B1',
      shelf: 'S4'
    },
    tags: ['jacket', 'winter', 'waterproof', 'clothing'],
    isActive: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user_2',
    updatedBy: 'user_2'
  },
  {
    _id: 'prod_10',
    name: 'Coffee Beans',
    description: 'Premium arabica coffee beans, dark roast, 500g',
    sku: 'CB-010',
    category: 'Food & Beverages',
    price: 24.99,
    costPrice: 15.00,
    stock: 0,
    minStock: 12,
    maxStock: 100,
    unit: 'pack',
    barcode: '0123456789012',
    status: 'out_of_stock',
    supplier: {
      _id: 'sup_6',
      name: 'Coffee Roasters Inc.',
      contact: 'supply@coffeeroasters.com'
    },
    location: {
      warehouse: 'Main',
      aisle: 'C2',
      shelf: 'S1'
    },
    tags: ['coffee', 'beans', 'arabica', 'dark-roast'],
    isActive: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user_1',
    updatedBy: 'user_1'
  }
]

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

    // Get query parameters
    const query = getQuery(event) as ProductFilter
    const {
      search = '',
      category = '',
      status = '',
      supplier = '',
      lowStock = false,
      isActive = true,
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc'
    } = query

    // Apply filters
    let filteredProducts = mockProducts

    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category === category)
    }

    // Filter by status
    if (status) {
      filteredProducts = filteredProducts.filter(product => product.status === status)
    }

    // Filter by supplier
    if (supplier) {
      filteredProducts = filteredProducts.filter(product => product.supplier?._id === supplier)
    }

    // Filter by low stock
    if (lowStock === true || lowStock === 'true') {
      filteredProducts = filteredProducts.filter(product => product.stock <= product.minStock)
    }

    // Filter by active status
    if (isActive !== undefined) {
      const activeFilter = isActive === true || isActive === 'true'
      filteredProducts = filteredProducts.filter(product => product.isActive === activeFilter)
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Product]
      let bValue: any = b[sortBy as keyof Product]

      // Handle nested properties
      if (sortBy === 'supplier') {
        aValue = a.supplier?.name || ''
        bValue = b.supplier?.name || ''
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      }
    })

    // Apply pagination
    const total = filteredProducts.length
    const pages = Math.ceil(total / Number(limit))
    const startIndex = (Number(page) - 1) * Number(limit)
    const endIndex = startIndex + Number(limit)
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    // Calculate statistics
    const stats = {
      total: filteredProducts.length,
      active: filteredProducts.filter(p => p.isActive && p.status === 'active').length,
      inactive: filteredProducts.filter(p => !p.isActive || p.status === 'inactive').length,
      lowStock: filteredProducts.filter(p => p.stock <= p.minStock).length,
      outOfStock: filteredProducts.filter(p => p.stock === 0).length,
      totalValue: filteredProducts.reduce((sum, p) => sum + (p.price * p.stock), 0),
      totalCostValue: filteredProducts.reduce((sum, p) => sum + (p.costPrice * p.stock), 0),
      categories: [...new Set(filteredProducts.map(p => p.category))].length,
      suppliers: [...new Set(filteredProducts.map(p => p.supplier?._id).filter(Boolean))].length
    }

    // Category breakdown
    const categoryBreakdown = filteredProducts.reduce((acc, product) => {
      const cat = product.category
      if (!acc[cat]) {
        acc[cat] = { total: 0, active: 0, lowStock: 0, totalValue: 0 }
      }
      acc[cat].total++
      if (product.isActive && product.status === 'active') acc[cat].active++
      if (product.stock <= product.minStock) acc[cat].lowStock++
      acc[cat].totalValue += product.price * product.stock
      return acc
    }, {} as Record<string, any>)

    return {
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages,
          hasNext: Number(page) < pages,
          hasPrev: Number(page) > 1
        },
        stats,
        categoryBreakdown,
        filters: {
          searchTerm: search,
          category,
          status,
          supplier,
          lowStock,
          isActive,
          sortBy,
          sortOrder
        },
        meta: {
          timestamp: new Date().toISOString(),
          userRole,
          responseTime: Date.now() - Date.now() // Would be calculated properly in real app
        }
      }
    }

  } catch (error: any) {
    console.error('Get products error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products'
    })
  }
})