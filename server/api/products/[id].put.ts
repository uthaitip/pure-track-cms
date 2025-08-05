import { authenticateToken } from '../../utils/auth'
import type { UpdateProductData } from '~/composables/interfaces/product'

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

    const productId = getRouterParam(event, 'id')
    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID is required'
      })
    }

    const body = await readBody(event) as UpdateProductData
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
      status,
      supplier,
      location,
      tags,
      isActive
    } = body

    // Validate numeric fields if provided
    if (price !== undefined && price < 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Price must be non-negative'
      })
    }

    if (costPrice !== undefined && costPrice < 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cost price must be non-negative'
      })
    }

    if (stock !== undefined && stock < 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Stock must be non-negative'
      })
    }

    if (minStock !== undefined && minStock < 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Minimum stock must be non-negative'
      })
    }

    if (maxStock !== undefined && maxStock < 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Maximum stock must be non-negative'
      })
    }

    if (minStock !== undefined && maxStock !== undefined && minStock > maxStock) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Minimum stock cannot be greater than maximum stock'
      })
    }

    // Validate SKU format if provided
    if (sku && !/^[A-Z0-9-]+$/i.test(sku)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'SKU must contain only letters, numbers, and hyphens'
      })
    }

    // In a real application, check if product exists and update it
    // For now, we'll simulate the update
    const updatedProduct = {
      _id: productId,
      name: name?.trim(),
      description: description?.trim(),
      sku: sku?.trim().toUpperCase(),
      category,
      price: price !== undefined ? Number(price) : undefined,
      costPrice: costPrice !== undefined ? Number(costPrice) : undefined,
      stock: stock !== undefined ? Number(stock) : undefined,
      minStock: minStock !== undefined ? Number(minStock) : undefined,
      maxStock: maxStock !== undefined ? Number(maxStock) : undefined,
      unit,
      barcode: barcode?.trim(),
      image: image?.trim(),
      status: stock === 0 ? 'out-of-stock' : status,
      supplier,
      location,
      tags: tags?.map(tag => tag.trim().toLowerCase()),
      isActive,
      updatedAt: new Date().toISOString(),
      updatedBy: userId
    }

    // Remove undefined values
    Object.keys(updatedProduct).forEach(key => {
      if (updatedProduct[key as keyof typeof updatedProduct] === undefined) {
        delete updatedProduct[key as keyof typeof updatedProduct]
      }
    })

    console.log('Updated product:', updatedProduct)

    return {
      success: true,
      data: {
        product: updatedProduct
      },
      message: 'Product updated successfully'
    }

  } catch (error: any) {
    console.error('Update product error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update product'
    })
  }
})