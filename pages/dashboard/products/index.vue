<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Stock Products</h1>
        <p class="text-base-content/70 mt-2">Manage your inventory and stock levels</p>
      </div>
      
      <button
        class="btn btn-primary"
        @click="showAddProductModal = true"
      >
        <i class="fas fa-plus mr-2"></i>
        Add Product
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card bg-base-100 shadow">
      <div class="card-body">
        <div class="flex items-center justify-center py-12">
          <div class="loading loading-spinner loading-lg"></div>
          <span class="ml-4">Loading products...</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error">
      <i class="fas fa-exclamation-triangle"></i>
      <div>
        <h3 class="font-bold">Error loading products</h3>
        <div class="text-sm">{{ error.message || error }}</div>
      </div>
      <button class="btn btn-ghost btn-sm" @click="refresh">
        <i class="fas fa-redo mr-2"></i>
        Retry
      </button>
    </div>

    <!-- Products List -->
    <div v-if="!loading && !error" class="card bg-base-100 shadow overflow-hidden">
      <div class="card-body p-0">
        <div class="px-6 py-4 border-b border-base-300 flex items-center justify-between">
          <h2 class="card-title">Products ({{ products.length }})</h2>
          <div class="text-sm text-base-content/60">
            Total: {{ pagination.total }}
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product._id" class="hover">
                <td>
                  <div class="flex items-center space-x-3">
                    <div class="avatar">
                      <div class="mask mask-squircle w-12 h-12">
                        <img 
                          v-if="product.image" 
                          :src="product.image" 
                          :alt="product.name"
                          class="object-cover"
                        />
                        <div v-else class="bg-base-200 flex items-center justify-center">
                          <i class="fas fa-box text-base-content/40"></i>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="font-bold">{{ product.name }}</div>
                      <div class="text-sm opacity-50">{{ product.description }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <code class="text-xs bg-base-200 px-2 py-1 rounded">{{ product.sku }}</code>
                </td>
                <td>
                  <div class="badge badge-ghost">{{ product.category }}</div>
                </td>
                <td>
                  <div class="font-semibold">${{ product.price.toFixed(2) }}</div>
                  <div class="text-xs opacity-60">Cost: ${{ product.costPrice.toFixed(2) }}</div>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <span 
                      :class="[
                        'font-bold',
                        product.stock <= product.minStock ? 'text-error' : 
                        product.stock <= product.minStock * 2 ? 'text-warning' : 'text-success'
                      ]"
                    >
                      {{ product.stock }}
                    </span>
                    <span class="text-xs opacity-60">{{ product.unit }}</span>
                  </div>
                </td>
                <td>
                  <span 
                    :class="[
                      'badge badge-sm',
                      getStatusBadgeClass(product.status)
                    ]"
                  >
                    {{ product.status.replace('_', ' ').toUpperCase() }}
                  </span>
                </td>
                <td>
                  <div class="flex space-x-2">
                    <button 
                      class="btn btn-ghost btn-xs"
                      @click="viewProduct(product)"
                      title="View Details"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      class="btn btn-ghost btn-xs"
                      @click="editProduct(product)"
                      title="Edit Product"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      class="btn btn-ghost btn-xs text-error"
                      @click="confirmDeleteProduct(product)"
                      title="Delete Product"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Empty State -->
          <div v-if="products.length === 0" class="text-center py-12">
            <i class="fas fa-boxes text-4xl text-base-content/30 mb-4"></i>
            <h3 class="text-lg font-semibold text-base-content/70">No products found</h3>
            <p class="text-base-content/50">Start by adding your first product</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Details Modal -->
    <div v-if="productToView" class="modal modal-open">
      <div class="modal-box w-11/12 max-w-2xl">
        <h3 class="font-bold text-lg mb-4">{{ productToView.name }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="font-semibold mb-2">Basic Information</h4>
            <div class="space-y-2 text-sm">
              <div><strong>SKU:</strong> {{ productToView.sku }}</div>
              <div><strong>Category:</strong> {{ productToView.category }}</div>
              <div><strong>Unit:</strong> {{ productToView.unit }}</div>
              <div><strong>Barcode:</strong> {{ productToView.barcode || 'N/A' }}</div>
            </div>
          </div>
          
          <div>
            <h4 class="font-semibold mb-2">Pricing & Stock</h4>
            <div class="space-y-2 text-sm">
              <div><strong>Price:</strong> ${{ productToView.price.toFixed(2) }}</div>
              <div><strong>Cost:</strong> ${{ productToView.costPrice.toFixed(2) }}</div>
              <div><strong>Current Stock:</strong> {{ productToView.stock }}</div>
              <div><strong>Min Stock:</strong> {{ productToView.minStock }}</div>
              <div><strong>Max Stock:</strong> {{ productToView.maxStock }}</div>
            </div>
          </div>
        </div>
        
        <div class="modal-action">
          <button class="btn btn-ghost" @click="productToView = null">Close</button>
        </div>
      </div>
    </div>

    <!-- Product Form Modal -->
    <ProductFormModal
      :is-open="showAddProductModal || !!productToEdit"
      :product="productToEdit"
      @close="handleModalClose"
      @product-created="handleProductCreated"
      @product-updated="handleProductUpdated"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="productToDelete" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Delete Product</h3>
        <p class="py-4">
          Are you sure you want to delete <strong>{{ productToDelete.name }}</strong> (SKU: {{ productToDelete.sku }})?
          This action cannot be undone.
        </p>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="productToDelete = null">Cancel</button>
          <button 
            class="btn btn-error" 
            @click="deleteProduct" 
            :disabled="deletingProductId === productToDelete._id"
          >
            <span v-if="deletingProductId === productToDelete._id" class="loading loading-spinner loading-sm"></span>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/composables/interfaces/product'
import ProductFormModal from '~/components/inventory/ProductFormModal.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

// Use manual data fetching with authentication
const { token } = useAuth()
const data = ref({ success: false, data: { products: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } } })
const status = ref('idle')
const error = ref(null)

const fetchProducts = async () => {
  if (!token.value) {
    error.value = { message: 'Authentication required' }
    return
  }

  status.value = 'pending'
  error.value = null

  try {
    const response = await $fetch('/api/products', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    } as any)
    data.value = response as any
    status.value = 'success'
  } catch (err: any) {
    console.error('Fetch products error:', err)
    error.value = err
    status.value = 'error'
  }
}

const refresh = () => fetchProducts()

// Fetch on mount
onMounted(() => {
  if (token.value) {
    fetchProducts()
  }
})

// Computed properties
const products = computed(() => data.value?.data?.products || [])
const pagination = computed(() => data.value?.data?.pagination || { page: 1, limit: 10, total: 0, pages: 0 })
const loading = computed(() => status.value === 'pending')

// Local state
const showAddProductModal = ref(false)
const productToEdit = ref<Product | null>(null)
const productToDelete = ref<Product | null>(null)
const productToView = ref<Product | null>(null)
const deletingProductId = ref<string | null>(null)

// Methods
const getStatusBadgeClass = (status: string) => {
  const classes = {
    active: 'badge-success',
    inactive: 'badge-error',
    out_of_stock: 'badge-warning',
    discontinued: 'badge-neutral'
  }
  return classes[status as keyof typeof classes] || 'badge-neutral'
}

const viewProduct = (product: Product) => {
  productToView.value = product
}

const editProduct = (product: Product) => {
  productToEdit.value = product
}

const confirmDeleteProduct = (product: Product) => {
  productToDelete.value = product
}

const deleteProduct = async () => {
  if (!productToDelete.value) return
  
  const product = productToDelete.value
  deletingProductId.value = product._id
  
  try {
    if (!token.value) {
      throw new Error('Authentication required')
    }

    await $fetch(`/api/products/${product._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    } as any)
    
    // Refresh the data
    await refresh()
    
    // Show success message
    console.log(`Product ${product.name} deleted successfully`)
    
    // Close modal
    productToDelete.value = null
    
  } catch (err: any) {
    console.error('Delete product error:', err)
    error.value = err.data?.statusMessage || err.message || 'Failed to delete product'
  } finally {
    deletingProductId.value = null
  }
}

// Modal handlers
const handleModalClose = () => {
  showAddProductModal.value = false
  productToEdit.value = null
}

const handleProductCreated = (product: Product) => {
  console.log('Product created:', product.name)
  // Refresh the data to show the new product
  refresh()
}

const handleProductUpdated = (product: Product) => {
  console.log('Product updated:', product.name)
  // Refresh the data to show updated product
  refresh()
}

// SEO meta
useSeoMeta({
  title: 'Stock Products - Inventory Management',
  description: 'Manage your product inventory and stock levels'
})
</script>