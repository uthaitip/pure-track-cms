<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Orders Management</h1>
        <p class="text-base-content/70 mt-2">Manage customer orders, invoices, and track sales</p>
      </div>
      
      <button
        class="btn btn-primary"
        @click="showCreateOrderModal = true"
      >
        <i class="fas fa-plus mr-2"></i>
        Create Order
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="stat bg-base-100 shadow rounded-box">
        <div class="stat-figure text-primary">
          <i class="fas fa-shopping-cart text-2xl"></i>
        </div>
        <div class="stat-title">Total Orders</div>
        <div class="stat-value text-primary">{{ stats.total }}</div>
        <div class="stat-desc">{{ stats.confirmed }} confirmed</div>
      </div>
      
      <div class="stat bg-base-100 shadow rounded-box">
        <div class="stat-figure text-secondary">
          <i class="fas fa-dollar-sign text-2xl"></i>
        </div>
        <div class="stat-title">Revenue</div>
        <div class="stat-value text-secondary">${{ stats.totalRevenue.toLocaleString() }}</div>
        <div class="stat-desc">${{ stats.averageOrderValue.toFixed(2) }} avg order</div>
      </div>
      
      <div class="stat bg-base-100 shadow rounded-box">
        <div class="stat-figure text-accent">
          <i class="fas fa-truck text-2xl"></i>
        </div>
        <div class="stat-title">Shipped</div>
        <div class="stat-value text-accent">{{ stats.shipped }}</div>
        <div class="stat-desc">{{ stats.delivered }} delivered</div>
      </div>
      
      <div class="stat bg-base-100 shadow rounded-box">
        <div class="stat-figure text-warning">
          <i class="fas fa-clock text-2xl"></i>
        </div>
        <div class="stat-title">Pending</div>
        <div class="stat-value text-warning">{{ stats.pending }}</div>
        <div class="stat-desc">{{ stats.pendingPayments }} payment pending</div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card bg-base-100 shadow mb-6">
      <div class="card-body">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="form-control flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search orders by ID, customer..."
              class="input input-bordered"
              @input="debouncedSearch"
            />
          </div>
          <div class="form-control">
            <select
              v-model="selectedStatus"
              class="select select-bordered"
              @change="applyFilters"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="form-control">
            <select
              v-model="selectedTimeRange"
              class="select select-bordered"
              @change="applyFilters"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card bg-base-100 shadow">
      <div class="card-body">
        <div class="flex items-center justify-center py-12">
          <div class="loading loading-spinner loading-lg"></div>
          <span class="ml-4">Loading orders...</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error">
      <i class="fas fa-exclamation-triangle"></i>
      <div>
        <h3 class="font-bold">Error loading orders</h3>
        <div class="text-sm">{{ error }}</div>
      </div>
      <button class="btn btn-ghost btn-sm">
        <i class="fas fa-redo mr-2"></i>
        Retry
      </button>
    </div>

    <!-- Orders List -->
    <div v-else class="card bg-base-100 shadow overflow-hidden">
      <div class="card-body p-0">
        <div class="px-6 py-4 border-b border-base-300 flex justify-between items-center">
          <h2 class="card-title">Orders ({{ orders.length }})</h2>
          <div class="text-sm text-base-content/60">
            Showing {{ orders.length }} of {{ totalOrders }} orders
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id" class="hover">
                <td>
                  <div class="font-mono text-sm">#{{ order.orderNumber }}</div>
                </td>
                <td>
                  <div>
                    <div class="font-semibold">{{ order.customer.name }}</div>
                    <div class="text-sm opacity-50">{{ order.customer.email }}</div>
                  </div>
                </td>
                <td>
                  <div class="flex items-center space-x-2">
                    <span class="badge badge-ghost">{{ order.items.length }} items</span>
                    <div class="tooltip" :data-tip="getItemsTooltip(order.items)">
                      <i class="fas fa-info-circle text-sm opacity-50"></i>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="font-semibold">${{ order.total.toFixed(2) }}</div>
                </td>
                <td>
                  <div 
                    class="badge"
                    :class="getStatusBadgeClass(order.status)"
                  >
                    {{ order.status }}
                  </div>
                </td>
                <td>
                  <div class="text-sm">
                    {{ formatDate(order.createdAt) }}
                  </div>
                </td>
                <td>
                  <div class="flex space-x-2">
                    <button 
                      class="btn btn-ghost btn-xs"
                      @click="viewOrder(order)"
                    >
                      <i class="fas fa-eye"></i>
                      View
                    </button>
                    <button 
                      class="btn btn-ghost btn-xs"
                      @click="editOrder(order)"
                      v-if="order.status !== 'delivered' && order.status !== 'cancelled'"
                    >
                      <i class="fas fa-edit"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Empty State -->
          <div v-if="orders.length === 0" class="text-center py-12">
            <i class="fas fa-shopping-cart text-4xl text-base-content/30 mb-4"></i>
            <h3 class="text-lg font-semibold text-base-content/70">No orders found</h3>
            <p class="text-base-content/50">Orders will appear here when customers make purchases</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-6">
      <div class="join">
        <button 
          class="join-item btn"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <button
          v-for="page in visiblePages"
          :key="page"
          class="join-item btn"
          :class="{ 'btn-active': page === currentPage }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        
        <button 
          class="join-item btn"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="selectedOrder" class="modal modal-open">
      <div class="modal-box max-w-4xl">
        <h3 class="font-bold text-lg mb-4">Order Details - #{{ selectedOrder.orderNumber }}</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Customer Info -->
          <div class="card bg-base-200">
            <div class="card-body">
              <h4 class="card-title text-base">Customer Information</h4>
              <div class="space-y-2 text-sm">
                <p><strong>Name:</strong> {{ selectedOrder.customer.name }}</p>
                <p><strong>Email:</strong> {{ selectedOrder.customer.email }}</p>
                <p><strong>Phone:</strong> {{ selectedOrder.customer.phone || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Shipping Info -->
          <div class="card bg-base-200">
            <div class="card-body">
              <h4 class="card-title text-base">Shipping Address</h4>
              <div class="text-sm">
                <p>{{ selectedOrder.shippingAddress.street }}</p>
                <p>{{ selectedOrder.shippingAddress.city }}, {{ selectedOrder.shippingAddress.state }} {{ selectedOrder.shippingAddress.zipCode }}</p>
                <p>{{ selectedOrder.shippingAddress.country }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="mt-6">
          <h4 class="text-lg font-semibold mb-4">Order Items</h4>
          <div class="overflow-x-auto">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedOrder.items" :key="item.id">
                  <td>{{ item.productName }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>${{ item.price.toFixed(2) }}</td>
                  <td>${{ (item.quantity * item.price).toFixed(2) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="3">Total</th>
                  <th>${{ selectedOrder.total.toFixed(2) }}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div class="modal-action">
          <button class="btn btn-ghost" @click="selectedOrder = null">Close</button>
        </div>
      </div>
    </div>

    <!-- Create Order Modal -->
    <CreateOrderModal
      :is-open="showCreateOrderModal"
      @close="showCreateOrderModal = false"
      @order-created="handleOrderCreated"
    />

    <!-- Success Toast -->
    <div v-if="successMessage" class="toast toast-top toast-end">
      <div class="alert alert-success">
        <i class="fas fa-check-circle"></i>
        <span>{{ successMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order, OrderFilter } from '~/composables/interfaces/order'
import { useOrders } from '~/composables/api/useOrders'
import CreateOrderModal from '~/components/orders/CreateOrderModal.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

// Composables
const { orders, loading, error, pagination, fetchOrders, updateOrder, generateInvoice, getOrderStats } = useOrders()

// Local state
const showCreateOrderModal = ref(false)
const selectedOrder = ref<Order | null>(null)
const generatingInvoice = ref<string | null>(null)
const updatingOrder = ref<string | null>(null)
const successMessage = ref('')

// Filters
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedTimeRange = ref('')
const filters = ref<OrderFilter>({
  search: '',
  status: undefined,
  paymentStatus: undefined,
  page: 1,
  limit: 10
})


// Computed
const stats = computed(() => getOrderStats())
const totalOrders = computed(() => pagination.value.total)
const currentPage = computed(() => pagination.value.page)
const totalPages = computed(() => pagination.value.pages)
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const applyFilters = () => {
  filters.value = {
    ...filters.value,
    search: searchQuery.value,
    status: selectedStatus.value || undefined,
    page: 1
  }
  fetchOrders(filters.value)
}

const debouncedSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  searchTimeout.value = setTimeout(() => {
    applyFilters()
  }, 500)
}

const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedTimeRange.value = ''
  filters.value = {
    search: '',
    status: undefined,
    paymentStatus: undefined,
    page: 1,
    limit: 10
  }
  fetchOrders(filters.value)
}

const refresh = () => {
  fetchOrders(filters.value)
}

const changePage = (page: number) => {
  filters.value.page = page
  fetchOrders(filters.value)
}

const viewOrder = (order: Order) => {
  selectedOrder.value = order
}

const editOrder = (order: Order) => {
  console.log('Edit order:', order)
  // TODO: Implement edit functionality
}

const handleGenerateInvoice = async (order: Order) => {
  generatingInvoice.value = order._id
  try {
    const invoice = await generateInvoice(order._id)
    successMessage.value = `Invoice ${invoice.invoiceNumber} generated successfully`
    setTimeout(() => successMessage.value = '', 3000)
    
    // Close modal if open
    if (selectedOrder.value?._id === order._id) {
      selectedOrder.value = null
    }
  } catch (err: any) {
    console.error('Generate invoice error:', err.message)
  } finally {
    generatingInvoice.value = null
  }
}

const markAsDelivered = async (order: Order) => {
  updatingOrder.value = order._id
  try {
    await updateOrder(order._id, { 
      status: 'delivered',
      deliveredAt: new Date().toISOString()
    })
    successMessage.value = `Order ${order.orderNumber} marked as delivered`
    setTimeout(() => successMessage.value = '', 3000)
  } catch (err: any) {
    console.error('Update order error:', err.message)
  } finally {
    updatingOrder.value = null
  }
}

const exportOrders = () => {
  // TODO: Implement export functionality
  console.log('Export orders')
}

const handleOrderCreated = async (order: Order) => {
  successMessage.value = `Order ${order.orderNumber} created successfully`
  setTimeout(() => successMessage.value = '', 3000)
  
  // Refresh orders list to show the new order
  await fetchOrders(filters.value)
  
  showCreateOrderModal.value = false
}

// Helper functions
const getStatusBadgeClass = (status: string) => {
  const classes = {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    processing: 'badge-primary',
    shipped: 'badge-accent',
    delivered: 'badge-success',
    cancelled: 'badge-error'
  }
  return classes[status as keyof typeof classes] || 'badge-neutral'
}

const getPaymentBadgeClass = (status: string) => {
  const classes = {
    pending: 'badge-warning',
    paid: 'badge-success',
    partial: 'badge-info',
    failed: 'badge-error',
    refunded: 'badge-neutral'
  }
  return classes[status as keyof typeof classes] || 'badge-neutral'
}

const getItemsTooltip = (items: any[]) => {
  return items.map(item => `${item.productName} (${item.quantity})`).join(', ')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Lifecycle
onMounted(() => {
  fetchOrders(filters.value)
})

// SEO meta
useSeoMeta({
  title: 'Orders Management - Inventory System',
  description: 'Manage customer orders, generate invoices, and track sales'
})
</script>