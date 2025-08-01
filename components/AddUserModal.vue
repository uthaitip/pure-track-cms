<template>
  <!-- Modal Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="closeModal"
  >
    <!-- Modal Content -->
    <div
      class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <h2 class="text-xl font-semibold text-gray-900">Add New User</h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Name Fields -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                v-model="form.firstName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="First name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                v-model="form.lastName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Last name"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email address"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password (min 6 chars)"
            />
          </div>

          <!-- Role -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              v-model="form.roleName"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="hr">HR Manager</option>
              <option value="accountant">Accountant</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <!-- Active Status -->
          <div class="flex items-center">
            <input
              v-model="form.isActive"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="ml-2 text-sm text-gray-700">
              Active (user can login)
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-3">
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="success" class="bg-green-50 border border-green-200 rounded-md p-3">
            <p class="text-sm text-green-800">{{ success }}</p>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-4">
            <AppButton
              variant="secondary"
              @click="closeModal"
              type="button"
              :disabled="loading"
            >
              Cancel
            </AppButton>
            <AppButton
              variant="primary"
              type="submit"
              :disabled="loading"
            >
              {{ loading ? 'Creating...' : 'Create User' }}
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
}

interface Emits {
  close: []
  userCreated: [user: any]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { token } = useAuth()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  roleName: '' as 'admin' | 'employee' | 'accountant' | 'hr' | '',
  isActive: true
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const resetForm = () => {
  Object.assign(form, {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleName: '',
    isActive: true
  })
  error.value = ''
  success.value = ''
}

const closeModal = () => {
  if (!loading.value) {
    resetForm()
    emit('close')
  }
}

const handleSubmit = async () => {
  if (!form.roleName) {
    error.value = 'Please select a role'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await $fetch('/api/user/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        roleName: form.roleName,
        isActive: form.isActive
      }
    })

    if (response.success) {
      success.value = 'User created successfully!'
      emit('userCreated', response.data.user)
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        closeModal()
      }, 1500)
    }

  } catch (err: any) {
    console.error('Create user error:', err)
    error.value = err.data?.statusMessage || 'Failed to create user'
  } finally {
    loading.value = false
  }
}

// Reset form when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm()
  }
})
</script>