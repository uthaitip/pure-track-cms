<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">User Management</h1>
        <p class="text-base-content/70 mt-2">Manage system users and their roles</p>
      </div>
      
      <button
        class="btn btn-primary"
        @click="showAddUserModal = true"
        v-if="hasRole(['admin', 'hr'])"
      >
        <i class="fas fa-user-plus mr-2"></i>
        Add User
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card bg-base-100 shadow">
      <div class="card-body">
        <div class="flex items-center justify-center py-12">
          <div class="loading loading-spinner loading-lg"></div>
          <span class="ml-4">Loading users...</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error">
      <i class="fas fa-exclamation-triangle"></i>
      <div>
        <h3 class="font-bold">Error loading users</h3>
        <div class="text-sm">{{ error.message || error }}</div>
      </div>
      <button class="btn btn-ghost btn-sm" @click="refresh">
        <i class="fas fa-redo mr-2"></i>
        Retry
      </button>
    </div>

    <!-- Filters and Search -->
    <div v-if="!loading && !error" class="card bg-base-100 shadow mb-6">
      <div class="card-body">
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <!-- Search -->
          <div class="form-control flex-1">
            <div class="input-group">
              <input
                type="text"
                placeholder="Search users..."
                class="input input-bordered flex-1"
                v-model="searchQuery"
                @input="applyFilters"
              />
              <button class="btn btn-square" @click="applyFilters">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
          
          <!-- Role Filter -->
          <div class="form-control">
            <select
              class="select select-bordered"
              v-model="selectedRole"
              @change="applyFilters"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="hr">HR</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
          </div>
          
          <!-- Status Filter -->
          <div class="form-control">
            <select
              class="select select-bordered"
              v-model="selectedStatus"
              @change="applyFilters"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <!-- Clear Filters -->
          <button class="btn btn-ghost" @click="clearFilters">
            <i class="fas fa-times mr-2"></i>
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics -->
    <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-figure text-primary">
            <i class="fas fa-users text-2xl"></i>
          </div>
          <div class="stat-title">Total Users</div>
          <div class="stat-value text-primary">{{ stats.total }}</div>
        </div>
      </div>
      
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-figure text-success">
            <i class="fas fa-user-check text-2xl"></i>
          </div>
          <div class="stat-title">Active</div>
          <div class="stat-value text-success">{{ stats.active }}</div>
        </div>
      </div>
      
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-figure text-error">
            <i class="fas fa-user-times text-2xl"></i>
          </div>
          <div class="stat-title">Inactive</div>
          <div class="stat-value text-error">{{ stats.inactive }}</div>
        </div>
      </div>
      
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-figure text-info">
            <i class="fas fa-chart-pie text-2xl"></i>
          </div>
          <div class="stat-title">Roles</div>
          <div class="stat-value text-info">{{ Object.keys(stats.roleStats).length }}</div>
        </div>
      </div>
    </div>

    <!-- Users List -->
    <div v-if="!loading && !error" class="card bg-base-100 shadow overflow-hidden">
      <div class="card-body p-0">
        <div class="px-6 py-4 border-b border-base-300 flex items-center justify-between">
          <h2 class="card-title">All Users ({{ filteredUsers.length }})</h2>
          <div class="text-sm text-base-content/60">
            Page {{ pagination.page }} of {{ pagination.pages }} • Total: {{ pagination.total }}
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user._id" class="hover">
                <td>
                  <div class="flex items-center space-x-3">
                    <div class="avatar placeholder">
                      <div class="bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center">
                        <span class="text-sm">{{ user.firstName?.charAt(0) }}{{ user.lastName?.charAt(0) }}</span>
                      </div>
                    </div>
                    <div>
                      <div class="font-bold">{{ user.firstName }} {{ user.lastName }}</div>
                      <div class="text-sm opacity-50">ID: {{ user._id.slice(-6) }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="text-sm">{{ user.email }}</div>
                </td>
                <td>
                  <div class="badge" :class="getRoleBadgeClass(user.role.name)">
                    {{ user.role.name.toUpperCase() }}
                  </div>
                </td>
                <td>
                  <div class="badge" :class="user.isActive ? 'badge-success' : 'badge-error'">
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </div>
                </td>
                <td>
                  <div class="text-sm">{{ formatDate(user.createdAt) }}</div>
                </td>
                <td>
                  <div class="flex space-x-2">
                    <button 
                      class="btn btn-ghost btn-xs"
                      @click="editUser(user)"
                      :disabled="editingUserId === user._id"
                    >
                      <i class="fas fa-edit"></i>
                      Edit
                    </button>
                    <button 
                      v-if="user.email !== currentUser?.email"
                      class="btn btn-ghost btn-xs text-error"
                      @click="confirmDeleteUser(user)"
                      :disabled="deletingUserId === user._id"
                    >
                      <i class="fas fa-trash"></i>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Empty State -->
          <div v-if="filteredUsers.length === 0" class="text-center py-12">
            <i class="fas fa-users text-4xl text-base-content/30 mb-4"></i>
            <h3 class="text-lg font-semibold text-base-content/70">No users found</h3>
            <p class="text-base-content/50">Start by adding your first user</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <UIUserManagementAddUserModal
      :is-open="showAddUserModal"
      @close="showAddUserModal = false"
      @user-created="handleUserCreated"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="userToDelete" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Delete User</h3>
        <p class="py-4">
          Are you sure you want to delete <strong>{{ userToDelete.firstName }} {{ userToDelete.lastName }}</strong>?
          This action cannot be undone.
        </p>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="userToDelete = null">Cancel</button>
          <button 
            class="btn btn-error" 
            @click="deleteUser" 
            :disabled="deletingUserId === userToDelete._id"
          >
            <span v-if="deletingUserId === userToDelete._id" class="loading loading-spinner loading-sm"></span>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/composables/interfaces/user'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  roles: ['admin', 'hr']
})

const { hasRole, user: currentUser } = useAuth()

// Local state
const showAddUserModal = ref(false)
const userToDelete = ref<User | null>(null)
const editingUserId = ref<string | null>(null)
const deletingUserId = ref<string | null>(null)
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')

// Use useFetch for data fetching with reactive query params
const queryParams = computed(() => {
  const params = new URLSearchParams()
  if (searchQuery.value) params.append('search', searchQuery.value)
  if (selectedRole.value) params.append('role', selectedRole.value)
  if (selectedStatus.value) params.append('status', selectedStatus.value)
  return params.toString()
})

const { data, status, refresh, error } = await useFetch(() => {
  const baseUrl = '/api/users'
  const query = queryParams.value
  return query ? `${baseUrl}?${query}` : baseUrl
}, {
  key: 'users',
  default: () => ({ success: false, data: { users: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } } })
})

// Computed properties
const users = computed(() => data.value?.data?.users || [])
console.log('users ===>', users.value);
console.log('user value', users);
const pagination = computed(() => data.value?.data?.pagination || { page: 1, limit: 10, total: 0, pages: 0 })
const loading = computed(() => status.value === 'pending')

const filteredUsers = computed(() => {
  let filtered = users.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }
  
  if (selectedRole.value) {
    filtered = filtered.filter(user => user.role.name === selectedRole.value)
  }
  
  if (selectedStatus.value) {
    const isActive = selectedStatus.value === 'active'
    filtered = filtered.filter(user => user.isActive === isActive)
  }
  
  return filtered
})

// Statistics computed from current users
const stats = computed(() => {
  const total = users.value.length
  const active = users.value.filter(u => u.isActive).length
  const inactive = total - active
  
  // Role distribution
  const roleStats = users.value.reduce((acc, user) => {
    const role = user.role.name
    if (!acc[role]) {
      acc[role] = { total: 0, active: 0, inactive: 0 }
    }
    acc[role].total++
    if (user.isActive) {
      acc[role].active++
    } else {
      acc[role].inactive++
    }
    return acc
  }, {} as Record<string, { total: number; active: number; inactive: number }>)

  return {
    total,
    active,
    inactive,
    roleStats
  }
})

// Role badge classes for DaisyUI
const getRoleBadgeClass = (role: string) => {
  const classes = {
    admin: 'badge-error',
    hr: 'badge-info', 
    accountant: 'badge-success',
    employee: 'badge-neutral'
  }
  return classes[role as keyof typeof classes] || 'badge-neutral'
}

// Format date helper
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric'
  })
}

// Edit user (placeholder for now)
const editUser = (user: User) => {
  editingUserId.value = user._id
  // TODO: Implement edit functionality
  console.log('Editing user:', user)
  
  // Simulate API call delay
  setTimeout(() => {
    editingUserId.value = null
  }, 1000)
}

// Confirm delete user
const confirmDeleteUser = (user: User) => {
  userToDelete.value = user
}

// Delete user
const deleteUser = async () => {
  if (!userToDelete.value) return
  
  const user = userToDelete.value
  deletingUserId.value = user._id
  
  try {
    const { token } = useAuth()
    
    if (!token.value) {
      throw new Error('Authentication required')
    }

    await $fetch(`/api/user/${user._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    
    // Refresh the data
    await refresh()
    
    // Show success message (you could use a toast notification here)
    console.log(`User ${user.firstName} ${user.lastName} deleted successfully`)
    
    // Close modal
    userToDelete.value = null
    
  } catch (err: any) {
    console.error('Delete user error:', err.message)
    // You could show an error toast here
  } finally {
    deletingUserId.value = null
  }
}

// Handle new user created from modal
const handleUserCreated = async () => {
  showAddUserModal.value = false
  // Refresh users list to get updated data
  await refresh()
}

// Apply filters - the reactive queryParams will automatically trigger useFetch
const applyFilters = () => {
  // The useFetch will automatically re-run due to reactive queryParams
  // No additional action needed
}

// Clear filters
const clearFilters = () => {
  searchQuery.value = ''
  selectedRole.value = ''
  selectedStatus.value = ''
  // The useFetch will automatically re-run due to reactive queryParams
}

// SEO meta
useSeoMeta({
  title: 'User Management - CMS System',
  description: 'Manage system users and roles'
})
</script>