<template>
  <div v-if="isOpen" class="modal modal-open">
    <div class="modal-box max-w-4xl">
      <h3 class="font-bold text-lg mb-6">Create New Order</h3>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Customer Information -->
        <div class="card bg-base-200">
          <div class="card-body">
            <h4 class="card-title text-base mb-4">Customer Information</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Customer Name *</span>
                </label>
                <input
                  v-model="formData.customer.name"
                  type="text"
                  placeholder="Enter customer name"
                  class="input input-bordered"
                  :class="{ 'input-error': errors.customerName }"
                  required
                />
                <label v-if="errors.customerName" class="label">
                  <span class="label-text-alt text-error">{{ errors.customerName }}</span>
                </label>
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Email</span>
                </label>
                <input
                  v-model="formData.customer.email"
                  type="email"
                  placeholder="customer@example.com"
                  class="input input-bordered"
                  :class="{ 'input-error': errors.customerEmail }"
                />
                <label v-if="errors.customerEmail" class="label">
                  <span class="label-text-alt text-error">{{ errors.customerEmail }}</span>
                </label>
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Phone</span>
                </label>
                <input
                  v-model="formData.customer.phone"
                  type="tel"
                  placeholder="+1-555-0123"
                  class="input input-bordered"
                />
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">City</span>
                </label>
                <input
                  v-model="formData.customer.city"
                  type="text"
                  placeholder="Enter city"
                  class="input input-bordered"
                />
              </div>
            </div>
            
            <div class="form-control mt-4">
              <label class="label">
                <span class="label-text">Address</span>
              </label>
              <textarea
                v-model="formData.customer.address"
                class="textarea textarea-bordered h-20"
                placeholder="Enter full address"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="card bg-base-200">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <h4 class="card-title text-base">Order Items</h4>
              <button
                type="button"
                class="btn btn-primary btn-sm"
                @click="addOrderItem"
              >
                <i class="fas fa-plus mr-2"></i>
                Add Item
              </button>
            </div>
            
            <div v-if="formData.items.length === 0" class="text-center py-8 text-base-content/50">
              <i class="fas fa-shopping-cart text-3xl mb-2"></i>
              <p>No items added yet. Click "Add Item" to start building the order.</p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="(item, index) in formData.items"
                :key="index"
                class="card bg-base-100 shadow-sm"
              >
                <div class="card-body p-4">
                  <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div class="form-control md:col-span-2">
                      <label class="label">
                        <span class="label-text">Product *</span>
                      </label>
                      <select
                        v-model="item.productId"
                        class="select select-bordered"
                        :class="{ 'select-error': errors[`item${index}Product`] }"
                        @change="updateItemDetails(index)"
                      >
                        <option value="">Select product</option>
                        <option
                          v-for="product in availableProducts"
                          :key="product._id"
                          :value="product._id"
                          :disabled="product.stock === 0"
                        >
                          {{ product.name }} ({{ product.sku }}) - Stock: {{ product.stock }}
                        </option>
                      </select>
                      <label v-if="errors[`item${index}Product`]" class="label">
                        <span class="label-text-alt text-error">{{ errors[`item${index}Product`] }}</span>
                      </label>
                    </div>
                    
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text">Quantity *</span>
                      </label>
                      <input
                        v-model.number="item.quantity"
                        type="number"
                        min="1"
                        :max="getMaxQuantity(item.productId)"
                        class="input input-bordered"
                        :class="{ 'input-error': errors[`item${index}Quantity`] }"
                        @input="updateItemTotal(index)"
                      />
                      <label v-if="errors[`item${index}Quantity`]" class="label">
                        <span class="label-text-alt text-error">{{ errors[`item${index}Quantity`] }}</span>
                      </label>
                    </div>
                    
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text">Unit Price</span>
                      </label>
                      <input
                        v-model.number="item.unitPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        class="input input-bordered"
                        @input="updateItemTotal(index)"
                      />
                    </div>
                    
                    <div class="flex items-center justify-between">
                      <div class="text-right">
                        <div class="text-sm text-base-content/60">Total</div>
                        <div class="font-bold">${{ (item.quantity * item.unitPrice).toFixed(2) }}</div>
                      </div>
                      <button
                        type="button"
                        class="btn btn-ghost btn-sm text-error ml-2"
                        @click="removeOrderItem(index)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="card bg-base-200">
          <div class="card-body">
            <h4 class="card-title text-base mb-4">Order Summary</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Payment Method</span>
                </label>
                <select v-model="formData.paymentMethod" class="select select-bordered">
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="check">Check</option>
                  <option value="online">Online Payment</option>
                </select>
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Discount ($)</span>
                </label>
                <input
                  v-model.number="formData.discount"
                  type="number"
                  step="0.01"
                  min="0"
                  :max="subtotal"
                  class="input input-bordered"
                  @input="calculateTotal"
                />
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Shipping ($)</span>
                </label>
                <input
                  v-model.number="formData.shipping"
                  type="number"
                  step="0.01"
                  min="0"
                  class="input input-bordered"
                  @input="calculateTotal"
                />
              </div>
            </div>
            
            <div class="form-control mt-4">
              <label class="label">
                <span class="label-text">Notes</span>
              </label>
              <textarea
                v-model="formData.notes"
                class="textarea textarea-bordered h-20"
                placeholder="Order notes or special instructions..."
              ></textarea>
            </div>
            
            <!-- Order Totals -->
            <div class="mt-6 bg-base-100 rounded-lg p-4">
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span>Subtotal:</span>
                  <span class="font-semibold">${{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Tax (8%):</span>
                  <span class="font-semibold">${{ tax.toFixed(2) }}</span>
                </div>
                <div v-if="formData.discount > 0" class="flex justify-between text-success">
                  <span>Discount:</span>
                  <span class="font-semibold">-${{ formData.discount.toFixed(2) }}</span>
                </div>
                <div v-if="formData.shipping > 0" class="flex justify-between">
                  <span>Shipping:</span>
                  <span class="font-semibold">${{ formData.shipping.toFixed(2) }}</span>
                </div>
                <hr class="my-2">
                <div class="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${{ total.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- General Error -->
        <div v-if="generalError" class="alert alert-error">
          <i class="fas fa-exclamation-triangle"></i>
          <span>{{ generalError }}</span>
        </div>

        <!-- Modal Actions -->
        <div class="modal-action">
          <button
            type="button"
            class="btn btn-ghost"
            @click="handleClose"
            :disabled="submitting"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="submitting || formData.items.length === 0"
          >
            <span v-if="submitting" class="loading loading-spinner loading-sm mr-2"></span>
            Create Order
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateOrderData, Customer } from '~/composables/interfaces/order'
import type { Product } from '~/composables/interfaces/product'
import { useOrders } from '~/composables/api/useOrders'
import { useProducts } from '~/composables/api/useProducts'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'order-created', order: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Composables
const { createOrder } = useOrders()
const { products: availableProducts, fetchProducts } = useProducts()

// Form data
const formData = ref<CreateOrderData>({
  customer: {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  },
  items: [],
  paymentMethod: 'cash',
  notes: '',
  discount: 0,
  shipping: 0
})

// State
const errors = ref<Record<string, string>>({})
const generalError = ref('')
const submitting = ref(false)

// Computed
const subtotal = computed(() => {
  return formData.value.items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice)
  }, 0)
})

const tax = computed(() => {
  return (subtotal.value - (formData.value.discount || 0)) * 0.08 // 8% tax
})

const total = computed(() => {
  return subtotal.value + tax.value + (formData.value.shipping || 0) - (formData.value.discount || 0)
})

// Methods
const addOrderItem = () => {
  formData.value.items.push({
    productId: '',
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    tax: 0
  })
}

const removeOrderItem = (index: number) => {
  formData.value.items.splice(index, 1)
}

const updateItemDetails = (index: number) => {
  const item = formData.value.items[index]
  const product = availableProducts.value.find(p => p._id === item.productId)
  
  if (product) {
    item.unitPrice = product.price
    item.quantity = Math.min(item.quantity, product.stock)
  }
}

const updateItemTotal = (index: number) => {
  // Recalculate totals when quantity or price changes
  calculateTotal()
}

const calculateTotal = () => {
  // Trigger reactivity for computed properties
  // The computed properties will automatically recalculate
}

const getMaxQuantity = (productId: string) => {
  const product = availableProducts.value.find(p => p._id === productId)
  return product ? product.stock : 999
}

const validateForm = (): boolean => {
  errors.value = {}
  
  // Validate customer
  if (!formData.value.customer.name.trim()) {
    errors.value.customerName = 'Customer name is required'
  }
  
  if (formData.value.customer.email && !isValidEmail(formData.value.customer.email)) {
    errors.value.customerEmail = 'Please enter a valid email address'
  }
  
  // Validate items
  if (formData.value.items.length === 0) {
    generalError.value = 'Please add at least one item to the order'
    return false
  }
  
  let hasItemErrors = false
  formData.value.items.forEach((item, index) => {
    if (!item.productId) {
      errors.value[`item${index}Product`] = 'Please select a product'
      hasItemErrors = true
    }
    
    if (!item.quantity || item.quantity <= 0) {
      errors.value[`item${index}Quantity`] = 'Quantity must be greater than 0'
      hasItemErrors = true
    }
    
    const product = availableProducts.value.find(p => p._id === item.productId)
    if (product && item.quantity > product.stock) {
      errors.value[`item${index}Quantity`] = `Only ${product.stock} items available`
      hasItemErrors = true
    }
  })
  
  return !hasItemErrors && Object.keys(errors.value).length === 0
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  submitting.value = true
  generalError.value = ''
  
  try {
    const order = await createOrder(formData.value)
    emit('order-created', order)
    handleClose()
  } catch (error: any) {
    generalError.value = error.message || 'Failed to create order'
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  formData.value = {
    customer: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    items: [],
    paymentMethod: 'cash',
    notes: '',
    discount: 0,
    shipping: 0
  }
  errors.value = {}
  generalError.value = ''
}

const handleClose = () => {
  if (!submitting.value) {
    resetForm()
    emit('close')
  }
}

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    // Fetch products when modal opens
    if (availableProducts.value.length === 0) {
      fetchProducts()
    }
    resetForm()
  }
})
</script>