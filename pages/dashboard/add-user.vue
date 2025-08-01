<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Add New User</h1>
      <p class="text-gray-600 mt-2">Create a new user account for the system</p>
    </div>

    <div class="max-w-2xl">
      <div class="bg-white rounded-lg shadow p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Personal Information -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter first name"
                />
              </div>
              
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter last name"
                />
              </div>
            </div>
          </div>

          <!-- Account Information -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
            <div class="space-y-4">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  required
                  minlength="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter password (min 6 characters)"
                />
              </div>
              
              <div>
                <label for="role" class="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  id="role"
                  v-model="form.roleName"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="hr">HR Manager</option>
                  <option value="accountant">Accountant</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
              
              <div class="flex items-center">
                <input
                  id="isActive"
                  v-model="form.isActive"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="isActive" class="ml-2 block text-sm text-gray-700">
                  Active (user can login)
                </label>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <i class="fas fa-exclamation-circle text-red-400"></i>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="success" class="bg-green-50 border border-green-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <i class="fas fa-check-circle text-green-400"></i>
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-800">{{ success }}</p>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-4 pt-6 border-t">
            <AppButton
              variant="secondary"
              @click="$router.back()"
              type="button"
            >
              Cancel
            </AppButton>
            
            <AppButton
              variant="primary"
              type="submit"
              :disabled="loading"
            >
              {{ loading ? 'Creating User...' : 'Create User' }}
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  roles: ['admin', 'hr']
})

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
      
      // Reset form
      Object.assign(form, {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        roleName: '',
        isActive: true
      })
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigateTo('/dashboard/users')
      }, 2000)
    }

  } catch (err: any) {
    console.error('Create user error:', err)
    error.value = err.data?.statusMessage || 'Failed to create user'
  } finally {
    loading.value = false
  }
}

useSeoMeta({
  title: 'Add User - CMS System',
  description: 'Create a new user account'
})
</script>