import { authenticateToken } from '../../utils/auth'
import type { CreateOrderData, Order, OrderItem } from '~/composables/interfaces/order'

// Mock products data (in real app, this would be database queries)
const mockProducts = [
  { _id: 'prod_1', name: 'Wireless Bluetooth Headphones', sku: 'WH-001', price: 99.99, stock: 25 },
  { _id: 'prod_2', name: 'Cotton T-Shirt', sku: 'TS-002', price: 19.99, stock: 150 },
  { _id: 'prod_3', name: 'Organic Green Tea', sku: 'GT-003', price: 15.50, stock: 3 },
  { _id: 'prod_4', name: 'Office Chair', sku: 'OC-004', price: 199.99, stock: 12 },
  { _id: 'prod_5', name: 'Smartphone Case', sku: 'SC-005', price: 12.99, stock: 0 },
  { _id: 'prod_6', name: 'Gaming Mouse', sku: 'GM-006', price: 79.99, stock: 35 }
]

// Generate order number
const generateOrderNumber = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const timestamp = Date.now().toString().slice(-4)
  return `ORD-${year}${month}${day}-${timestamp}`
}

// Generate invoice number
const generateInvoiceNumber = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const timestamp = Date.now().toString().slice(-4)
  return `INV-${year}-${timestamp}`
}

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

    const body = await readBody(event) as CreateOrderData
    const { customer, items, paymentMethod = 'cash', notes = '', discount = 0, shipping = 0 } = body

    // Validate required fields
    if (!customer?.name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Customer name is required'
      })
    }

    if (!items || items.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Order must contain at least one item'
      })
    }

    // Validate and process order items
    const orderItems: OrderItem[] = []
    let subtotal = 0
    const stockReductions: Array<{ productId: string, quantity: number, currentStock: number }> = []

    for (const item of items) {
      const product = mockProducts.find(p => p._id === item.productId)
      
      if (!product) {
        throw createError({
          statusCode: 400,
          statusMessage: `Product with ID ${item.productId} not found`
        })
      }

      if (item.quantity <= 0) {
        throw createError({
          statusCode: 400,
          statusMessage: `Invalid quantity for product ${product.name}`
        })
      }

      if (product.stock < item.quantity) {
        throw createError({
          statusCode: 400,
          statusMessage: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        })
      }

      const unitPrice = item.unitPrice || product.price
      const totalPrice = unitPrice * item.quantity
      const itemDiscount = item.discount || 0
      const itemTax = (totalPrice - itemDiscount) * 0.08 // 8% tax rate

      const orderItem: OrderItem = {
        _id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId: item.productId,
        productName: product.name,
        productSku: product.sku,
        quantity: item.quantity,
        unitPrice,
        totalPrice: totalPrice - itemDiscount,
        discount: itemDiscount,
        tax: Math.round(itemTax * 100) / 100
      }

      orderItems.push(orderItem)
      subtotal += orderItem.totalPrice

      // Track stock reduction
      stockReductions.push({
        productId: item.productId,
        quantity: item.quantity,
        currentStock: product.stock
      })
    }

    // Calculate totals
    const totalTax = orderItems.reduce((sum, item) => sum + (item.tax || 0), 0)
    const total = subtotal + totalTax + shipping - discount

    // Create order
    const order: Order = {
      _id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber: generateOrderNumber(),
      customer: {
        ...customer,
        _id: customer._id || `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      },
      items: orderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(totalTax * 100) / 100,
      discount: discount,
      shipping: shipping,
      total: Math.round(total * 100) / 100,
      status: 'pending',
      paymentStatus: paymentMethod === 'cash' ? 'paid' : 'pending',
      paymentMethod,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId,
      invoiceNumber: generateInvoiceNumber(),
      invoiceGenerated: false
    }

    // In a real application, this would be a database transaction:
    // 1. Create the order
    // 2. Reduce stock for each product
    // 3. Create stock movement records
    // 4. Generate invoice if needed

    console.log('Order created:', order)
    console.log('Stock reductions to apply:', stockReductions)

    // Mock stock reduction (in real app, update database)
    stockReductions.forEach(reduction => {
      const product = mockProducts.find(p => p._id === reduction.productId)
      if (product) {
        product.stock -= reduction.quantity
        console.log(`Reduced stock for ${product.name}: ${reduction.currentStock} -> ${product.stock}`)
      }
    })

    return {
      success: true,
      data: {
        order,
        stockReductions: stockReductions.map(sr => ({
          productId: sr.productId,
          quantityReduced: sr.quantity,
          previousStock: sr.currentStock,
          newStock: sr.currentStock - sr.quantity
        }))
      },
      message: 'Order created successfully and stock updated'
    }

  } catch (error: any) {
    console.error('Create order error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create order'
    })
  }
})