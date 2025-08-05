import { authenticateToken } from '../../utils/auth'
import type { CreateProductData, Product } from '~/composables/interfaces/product'

export default defineEventHandler(async (event) => {
  try {
    const decoded = await authenticateToken(event)
    const userId = decoded.userId

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID not found'
      })
    }

    const body = await readBody(event) as CreateProductData
    const {
      name,
      description,
      sku,
      category,
      price,
      costPrice,
      stock,
      minStock,
      maxStock,
      unit,
      barcode,
      image,
      status = 'active',
      supplier,
      location,
      tags = [],
      isActive = true
    } = body

    // Validate required fields
    if (!name || !sku || !category || price === undefined || costPrice === undefined || 
        stock === undefined || minStock === undefined || maxStock === undefined || !unit) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: name, sku, category, price, costPrice, stock, minStock, maxStock, unit'
      })
    }

    // Validate numeric fields
    if (price < 0 || costPrice < 0 || stock < 0 || minStock < 0 || maxStock < 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Price, cost, and stock values must be non-negative'
      })
    }

    if (minStock > maxStock) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Minimum stock cannot be greater than maximum stock'
      })
    }

    // Validate SKU format (simple validation)
    if (!/^[A-Z0-9-]+$/i.test(sku)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'SKU must contain only letters, numbers, and hyphens'
      })
    }

    // Mock SKU duplication check (in real app, check database)
    const existingSkus = ['WH-001', 'TS-002', 'GT-003', 'OC-004', 'SC-005'] // Mock existing SKUs
    if (existingSkus.includes(sku.trim().toUpperCase())) {
      throw createError({
        statusCode: 409,
        statusMessage: 'SKU already exists. Please use a unique SKU.'
      })
    }

    // Create new product
    const newProduct: Product = {
      _id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      description: description?.trim(),
      sku: sku.trim().toUpperCase(),
      category,
      price: Number(price),
      costPrice: Number(costPrice),
      stock: Number(stock),
      minStock: Number(minStock),
      maxStock: Number(maxStock),
      unit,
      barcode: barcode?.trim(),
      image: image?.trim(),
      status: stock === 0 ? 'out-of-stock' : status,
      supplier,
      location,
      tags: tags.map(tag => tag.trim().toLowerCase()),
      isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId
    }

    // In a real application, save to database here
    console.log('Created product:', newProduct)

    return {
      success: true,
      data: {
        product: newProduct
      },
      message: 'Product created successfully'
    }

  } catch (error: any) {
    console.error('Create product error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create product'
    })
  }
})