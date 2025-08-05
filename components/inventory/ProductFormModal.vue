<template>
  <div v-if="isOpen" class="modal modal-open">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-4">
        {{ isEditing ? 'Edit Product' : 'Create New Product' }}
      </h3>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Product Name -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Product Name *</span>
          </label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="Enter product name"
            class="input input-bordered"
            :class="{ 'input-error': errors.name }"
            required
          />
          <label v-if="errors.name" class="label">
            <span class="label-text-alt text-error">{{ errors.name }}</span>
          </label>
        </div>

        <!-- SKU -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">SKU *</span>
          </label>
          <input
            v-model="formData.sku"
            type="text"
            placeholder="Enter product SKU"
            class="input input-bordered"
            :class="{ 'input-error': errors.sku }"
            required
          />
          <label v-if="errors.sku" class="label">
            <span class="label-text-alt text-error">{{ errors.sku }}</span>
          </label>
        </div>

        <!-- Category and Price Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Category *</span>
            </label>
            <select
              v-model="formData.category"
              class="select select-bordered"
              :class="{ 'select-error': errors.category }"
              required
            >
              <option value="">Select category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Food & Beverages">Food & Beverages</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Sports & Outdoors">Sports & Outdoors</option>
              <option value="Automotive">Automotive</option>
              <option value="Books & Media">Books & Media</option>
              <option value="Toys & Games">Toys & Games</option>
            </select>
            <label v-if="errors.category" class="label">
              <span class="label-text-alt text-error">{{ errors.category }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Selling Price *</span>
            </label>
            <input
              v-model.number="formData.price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              class="input input-bordered"
              :class="{ 'input-error': errors.price }"
              required
            />
            <label v-if="errors.price" class="label">
              <span class="label-text-alt text-error">{{ errors.price }}</span>
            </label>
          </div>
        </div>

        <!-- Cost Price and Unit Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Cost Price *</span>
            </label>
            <input
              v-model.number="formData.costPrice"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              class="input input-bordered"
              :class="{ 'input-error': errors.costPrice }"
              required
            />
            <label v-if="errors.costPrice" class="label">
              <span class="label-text-alt text-error">{{ errors.costPrice }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Unit *</span>
            </label>
            <select
              v-model="formData.unit"
              class="select select-bordered"
              :class="{ 'select-error': errors.unit }"
              required
            >
              <option value="">Select unit</option>
              <option value="piece">Piece</option>
              <option value="kg">Kilogram</option>
              <option value="g">Gram</option>
              <option value="liter">Liter</option>
              <option value="ml">Milliliter</option>
              <option value="meter">Meter</option>
              <option value="cm">Centimeter</option>
              <option value="box">Box</option>
              <option value="pack">Pack</option>
              <option value="dozen">Dozen</option>
            </select>
            <label v-if="errors.unit" class="label">
              <span class="label-text-alt text-error">{{ errors.unit }}</span>
            </label>
          </div>
        </div>

        <!-- Stock Quantities Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Current Stock *</span>
            </label>
            <input
              v-model.number="formData.stock"
              type="number"
              min="0"
              placeholder="0"
              class="input input-bordered"
              :class="{ 'input-error': errors.stock }"
              required
            />
            <label v-if="errors.stock" class="label">
              <span class="label-text-alt text-error">{{ errors.stock }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Min Stock *</span>
            </label>
            <input
              v-model.number="formData.minStock"
              type="number"
              min="0"
              placeholder="0"
              class="input input-bordered"
              :class="{ 'input-error': errors.minStock }"
              required
            />
            <label v-if="errors.minStock" class="label">
              <span class="label-text-alt text-error">{{ errors.minStock }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Max Stock *</span>
            </label>
            <input
              v-model.number="formData.maxStock"
              type="number"
              min="0"
              placeholder="0"
              class="input input-bordered"
              :class="{ 'input-error': errors.maxStock }"
              required
            />
            <label v-if="errors.maxStock" class="label">
              <span class="label-text-alt text-error">{{ errors.maxStock }}</span>
            </label>
          </div>
        </div>

        <!-- Status and Barcode Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Status *</span>
            </label>
            <select
              v-model="formData.status"
              class="select select-bordered"
              :class="{ 'select-error': errors.status }"
              required
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
            <label v-if="errors.status" class="label">
              <span class="label-text-alt text-error">{{ errors.status }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Barcode</span>
            </label>
            <input
              v-model="formData.barcode"
              type="text"
              placeholder="Enter barcode"
              class="input input-bordered"
              :class="{ 'input-error': errors.barcode }"
            />
            <label v-if="errors.barcode" class="label">
              <span class="label-text-alt text-error">{{ errors.barcode }}</span>
            </label>
          </div>
        </div>

        <!-- Image URL -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Image URL</span>
          </label>
          <input
            v-model="formData.image"
            type="url"
            placeholder="https://example.com/image.jpg"
            class="input input-bordered"
            :class="{ 'input-error': errors.image }"
          />
          <label v-if="errors.image" class="label">
            <span class="label-text-alt text-error">{{ errors.image }}</span>
          </label>
        </div>

        <!-- Description -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Description</span>
          </label>
          <textarea
            v-model="formData.description"
            class="textarea textarea-bordered h-24"
            placeholder="Enter product description..."
            :class="{ 'textarea-error': errors.description }"
          ></textarea>
          <label v-if="errors.description" class="label">
            <span class="label-text-alt text-error">{{ errors.description }}</span>
          </label>
        </div>

        <!-- General Error -->
        <div v-if="generalError" class="alert alert-error">
          <i class="fas fa-exclamation-triangle"></i>
          <span>{{ generalError }}</span>
        </div>

        <!-- Actions -->
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
            :disabled="submitting"
          >
            <span v-if="submitting" class="loading loading-spinner loading-sm"></span>
            {{ isEditing ? 'Update Product' : 'Create Product' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProducts } from '~/composables/api/useProducts'
import type { Product, CreateProductData } from '~/composables/interfaces/product'

interface Props {
  isOpen: boolean
  product?: Product | null
}

interface Emits {
  (e: 'close'): void
  (e: 'product-created', product: Product): void
  (e: 'product-updated', product: Product): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { createProduct, updateProduct } = useProducts()

const isEditing = computed(() => !!props.product)

const formData = ref({
  name: '',
  sku: '',
  category: '',
  price: 0,
  costPrice: 0,
  stock: 0,
  minStock: 0,
  maxStock: 0,
  unit: '',
  barcode: '',
  status: 'active' as 'active' | 'inactive' | 'out-of-stock' | 'discontinued',
  image: '',
  description: ''
})

const errors = ref<Record<string, string>>({})
const generalError = ref('')
const submitting = ref(false)

// Define resetForm function first
const resetForm = () => {
  formData.value = {
    name: '',
    sku: '',
    category: '',
    price: 0,
    costPrice: 0,
    stock: 0,
    minStock: 0,
    maxStock: 0,
    unit: '',
    barcode: '',
    status: 'active' as 'active' | 'inactive' | 'out-of-stock' | 'discontinued',
    image: '',
    description: ''
  }
  errors.value = {}
  generalError.value = ''
}

// Watch for product changes to populate form
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    formData.value = {
      name: newProduct.name,
      sku: newProduct.sku,
      category: newProduct.category,
      price: newProduct.price,
      costPrice: newProduct.costPrice,
      stock: newProduct.stock,
      minStock: newProduct.minStock,
      maxStock: newProduct.maxStock,
      unit: newProduct.unit,
      barcode: newProduct.barcode || '',
      status: newProduct.status,
      image: newProduct.image || '',
      description: newProduct.description || ''
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Watch for modal open/close to reset form
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && !props.product) {
    resetForm()
  }
  if (!isOpen) {
    errors.value = {}
    generalError.value = ''
  }
})

const validateForm = (): boolean => {
  errors.value = {}
  
  if (!formData.value.name.trim()) {
    errors.value.name = 'Product name is required'
  }
  
  if (!formData.value.sku.trim()) {
    errors.value.sku = 'SKU is required'
  }
  
  if (!formData.value.category) {
    errors.value.category = 'Category is required'
  }
  
  if (formData.value.price <= 0) {
    errors.value.price = 'Price must be greater than 0'
  }
  
  if (formData.value.costPrice < 0) {
    errors.value.costPrice = 'Cost price cannot be negative'
  }
  
  if (formData.value.stock < 0) {
    errors.value.stock = 'Stock cannot be negative'
  }
  
  if (formData.value.minStock < 0) {
    errors.value.minStock = 'Min stock cannot be negative'
  }
  
  if (formData.value.maxStock < 0) {
    errors.value.maxStock = 'Max stock cannot be negative'
  }
  
  if (formData.value.maxStock > 0 && formData.value.minStock > formData.value.maxStock) {
    errors.value.minStock = 'Min stock cannot be greater than max stock'
  }
  
  if (!formData.value.unit) {
    errors.value.unit = 'Unit is required'
  }
  
  if (!formData.value.status || !['active', 'inactive', 'out-of-stock', 'discontinued'].includes(formData.value.status)) {
    errors.value.status = 'Please select a valid status'
  }
  
  if (formData.value.image && !isValidUrl(formData.value.image)) {
    errors.value.image = 'Please enter a valid URL'
  }
  
  return Object.keys(errors.value).length === 0
}

const isValidUrl = (string: string): boolean => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  submitting.value = true
  generalError.value = ''
  
  try {
    if (isEditing.value && props.product) {
      const updatedProduct = await updateProduct(props.product._id, formData.value as CreateProductData)
      emit('product-updated', updatedProduct)
    } else {
      const newProduct = await createProduct(formData.value as CreateProductData)
      emit('product-created', newProduct)
    }
    
    handleClose()
  } catch (error: any) {
    generalError.value = error.message || 'An unexpected error occurred'
  } finally {
    submitting.value = false
  }
}

const handleClose = () => {
  if (!submitting.value) {
    resetForm()
    emit('close')
  }
}
</script>