export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'failed' | 'refunded'
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'check' | 'online'

export interface OrderItem {
  _id: string
  productId: string
  productName: string
  productSku: string
  quantity: number
  unitPrice: number
  totalPrice: number
  discount?: number
  tax?: number
}

export interface Customer {
  _id?: string
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

export interface Order {
  _id: string
  orderNumber: string
  customer: Customer
  items: OrderItem[]
  subtotal: number
  tax: number
  discount: number
  shipping: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod?: PaymentMethod
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy?: string
  shippedAt?: string
  deliveredAt?: string
  invoiceNumber?: string
  invoiceGenerated: boolean
}

export interface CreateOrderData {
  customer: Customer
  items: Omit<OrderItem, '_id' | 'productName' | 'productSku' | 'totalPrice'>[]
  paymentMethod?: PaymentMethod
  notes?: string
  discount?: number
  shipping?: number
}

export interface UpdateOrderData {
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  paymentMethod?: PaymentMethod
  notes?: string
  shippedAt?: string
  deliveredAt?: string
}

export interface OrderFilter {
  search?: string
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  customerId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface Invoice {
  _id: string
  invoiceNumber: string
  orderId: string
  order: Order
  customer: Customer
  items: OrderItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  issueDate: string
  dueDate: string  
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface OrderReport {
  period: string
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  ordersByStatus: Record<OrderStatus, number>
  paymentsByMethod: Record<PaymentMethod, number>
  topProducts: Array<{
    productId: string
    productName: string
    quantitySold: number
    revenue: number
  }>
  dailySales: Array<{
    date: string
    orders: number
    revenue: number
  }>
}