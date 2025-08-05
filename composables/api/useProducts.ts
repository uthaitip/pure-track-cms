import type { Product, CreateProductData, UpdateProductData, ProductFilter } from '../interfaces/product'

export const useProducts = () => {
  const products = useState<Product[]>('app.products', () => [])
  const loading = useState<boolean>('app.products.loading', () => false)
  const error = useState<string>('app.products.error', () => '')
  const pagination = useState('app.products.pagination', () => ({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  }))

  // Fetch products with optional filters
  const fetchProducts = async (filters?: ProductFilter) => {
    const { token } = useAuth()
    
    if (!token.value) {
      error.value = 'Authentication required'
      return
    }

    loading.value = true
    error.value = ''

    try {
      // Build query parameters
      const queryParams = new URLSearchParams()
      if (filters?.search) queryParams.append('search', filters.search)
      if (filters?.category) queryParams.append('category', filters.category)
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.supplier) queryParams.append('supplier', filters.supplier)
      if (filters?.lowStock !== undefined) queryParams.append('lowStock', filters.lowStock.toString())
      if (filters?.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString())
      if (filters?.page) queryParams.append('page', filters.page.toString())
      if (filters?.limit) queryParams.append('limit', filters.limit.toString())
      if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy)
      if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder)

      const queryString = queryParams.toString()
      const url = `/api/products${queryString ? '?' + queryString : ''}`

      const { data } = await $fetch<{
        success: boolean
        data: {
          products: Product[]
          pagination: {
            page: number
            limit: number
            total: number
            pages: number
          }
          filters: any
        }
      }>(url, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      if (data.products) {
        products.value = data.products
        pagination.value = data.pagination
      }
    } catch (err: any) {
      console.error('Fetch products error:', err)
      error.value = err.data?.statusMessage || 'Failed to fetch products'
    } finally {
      loading.value = false
    }
  }

  // Get product by ID
  const getProductById = async (productId: string): Promise<Product | null> => {
    const { token } = useAuth()
    
    if (!token.value) {
      throw new Error('Authentication required')
    }

    try {
      const { data } = await $fetch<{
        success: boolean
        data: { product: Product }
      }>(`/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      return data.product
    } catch (err: any) {
      console.error('Get product error:', err)
      throw new Error(err.data?.statusMessage || 'Failed to get product')
    }
  }

  // Create new product
  const createProduct = async (productData: CreateProductData): Promise<Product> => {
    const { token } = useAuth()
    
    if (!token.value) {
      throw new Error('Authentication required')
    }

    try {
      const { data } = await $fetch<{
        success: boolean
        data: { product: Product }
        message: string
      }>('/api/products/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: productData
      })

      // Add new product to local state
      products.value.unshift(data.product)
      pagination.value.total++

      return data.product
    } catch (err: any) {
      console.error('Create product error:', err)
      throw new Error(err.data?.statusMessage || 'Failed to create product')
    }
  }

  // Update product
  const updateProduct = async (productId: string, productData: UpdateProductData): Promise<Product> => {
    const { token } = useAuth()
    
    if (!token.value) {
      throw new Error('Authentication required')
    }

    try {
      const { data } = await $fetch<{
        success: boolean
        data: { product: Partial<Product> }
        message: string
      }>(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: productData
      })

      // Update product in local state
      const index = products.value.findIndex(p => p._id === productId)
      if (index !== -1) {
        products.value[index] = { ...products.value[index], ...data.product }
      }

      return products.value[index]
    } catch (err: any) {
      console.error('Update product error:', err)
      throw new Error(err.data?.statusMessage || 'Failed to update product')
    }
  }

  // Delete product
  const deleteProduct = async (productId: string): Promise<void> => {
    const { token } = useAuth()
    
    if (!token.value) {
      throw new Error('Authentication required')
    }

    try {
      await $fetch<{
        success: boolean
        message: string
      }>(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      // Remove product from local state
      products.value = products.value.filter(p => p._id !== productId)
      pagination.value.total--

    } catch (err: any) {
      console.error('Delete product error:', err)
      throw new Error(err.data?.statusMessage || 'Failed to delete product')
    }
  }

  // Get products statistics
  const getProductsStats = () => {
    const total = products.value.length
    const active = products.value.filter(p => p.isActive && p.status === 'active').length
    const inactive = products.value.filter(p => !p.isActive || p.status === 'inactive').length
    const lowStock = products.value.filter(p => p.stock <= p.minStock).length
    const outOfStock = products.value.filter(p => p.stock === 0).length
    
    // Total inventory value
    const totalValue = products.value.reduce((sum, product) => sum + (product.price * product.stock), 0)
    const totalCostValue = products.value.reduce((sum, product) => sum + (product.costPrice * product.stock), 0)

    return {
      total,
      active,
      inactive,
      lowStock,
      outOfStock,
      totalValue,
      totalCostValue,
      potentialProfit: totalValue - totalCostValue
    }
  }

  return {
    // State
    products: readonly(products),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),

    // Actions
    fetchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsStats
  }
}