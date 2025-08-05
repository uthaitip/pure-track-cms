<template>
  <!-- DaisyUI Modal -->
  <div v-if="isOpen" class="modal modal-open">
    <div class="modal-box w-11/12 max-w-2xl">
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Add New User</h2>
        <button
          @click="closeModal"
          class="btn btn-sm btn-circle btn-ghost"
          :disabled="loading"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Name Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">First Name *</span>
            </label>
            <input
              v-model="form.firstName"
              type="text"
              required
              class="input input-bordered"
              placeholder="First name"
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Last Name *</span>
            </label>
            <input
              v-model="form.lastName"
              type="text"
              required
              class="input input-bordered"
              placeholder="Last name"
            />
          </div>
        </div>

        <!-- Email -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Email Address *</span>
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            class="input input-bordered"
            placeholder="email@example.com"
          />
        </div>

        <!-- Password -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Password *</span>
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            minlength="6"
            class="input input-bordered"
            placeholder="Minimum 6 characters"
          />
        </div>

        <!-- Role -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Role *</span>
          </label>
          <select
            v-model="form.roleName"
            required
            class="select select-bordered"
          >
            <option value="">Select a role</option>
            <option value="admin">Administrator</option>
            <option value="hr">HR Manager</option>
            <option value="accountant">Accountant</option>
            <option value="employee">Employee</option>
          </select>
        </div>

        <!-- Active Status -->
        <div class="form-control">
          <label class="label cursor-pointer justify-start">
            <input
              v-model="form.isActive"
              type="checkbox"
              class="checkbox checkbox-primary mr-3"
            />
            <span class="label-text">Active (user can login)</span>
          </label>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="alert alert-error">
          <i class="fas fa-exclamation-circle"></i>
          <span>{{ error }}</span>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="alert alert-success">
          <i class="fas fa-check-circle"></i>
          <span>{{ success }}</span>
        </div>

        <!-- Form Actions -->
        <div class="modal-action">
          <button
            class="btn btn-ghost"
            @click="closeModal"
            type="button"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            class="btn btn-primary"
            type="submit"
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            Create User
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nuxtApiPost } from '~/utils/apiClientNuxt'
import { ApiError } from '~/utils/apiTypes'
import type { User } from '~/composables/interfaces/user'

interface Props {
  isOpen: boolean
}

interface Emits {
  close: []
  userCreated: [user: User]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

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
    const response = await nuxtApiPost<{
      success: boolean
      data: { user: User }
      message: string
    }>('/api/user/create', {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      roleName: form.roleName,
      isActive: form.isActive
    })

    if (response.success && response.data?.user) {
      success.value = 'User created successfully!'
      emit('userCreated', response.data.user)
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        closeModal()
      }, 1500)
    }

  } catch (err: any) {
    console.error('Create user error:', err)
    
    if (err instanceof ApiError) {
      error.value = err.data?.message || err.message || 'Failed to create user'
    } else {
      error.value = 'An unexpected error occurred'
    }
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