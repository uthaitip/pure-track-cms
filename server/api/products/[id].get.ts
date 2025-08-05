import { authenticateToken } from '../../utils/auth'

// Import the same mock products array (in real app, this would be database query)
const mockProducts = [
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
  }
  // Add more products as needed for demo
]

export default defineEventHandler(async (event) => {
  try {
    const decoded = await authenticateToken(event)
    
    if (!decoded) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    const productId = getRouterParam(event, 'id')
    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID is required'
      })
    }

    // Find product in mock array (in real app, query database)
    const product = mockProducts.find(p => p._id === productId)

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    // Calculate additional product metrics
    const stockStatus = product.stock === 0 ? 'out_of_stock' : 
                       product.stock <= product.minStock ? 'low_stock' :
                       product.stock >= product.maxStock ? 'overstocked' : 'normal'

    const profitMargin = ((product.price - product.costPrice) / product.price * 100).toFixed(2)
    const potentialRevenue = product.price * product.stock
    const inventoryValue = product.costPrice * product.stock

    // Related products (same category, different product)
    const relatedProducts = mockProducts
      .filter(p => p.category === product.category && p._id !== product._id)
      .slice(0, 3)
      .map(p => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        image: p.image,
        stock: p.stock
      }))

    return {
      success: true,
      data: {
        product: {
          ...product,
          metrics: {
            stockStatus,
            profitMargin: parseFloat(profitMargin),
            potentialRevenue,
            inventoryValue,
            daysInStock: Math.floor((Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
            lastUpdated: Math.floor((Date.now() - new Date(product.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
          }
        },
        relatedProducts,
        meta: {
          timestamp: new Date().toISOString(),
          userRole: decoded.role
        }
      },
      message: 'Product retrieved successfully'
    }

  } catch (error: any) {
    console.error('Get product error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve product'
    })
  }
})