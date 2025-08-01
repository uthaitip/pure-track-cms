<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
        <p class="text-gray-600 mt-2">Manage system users and their roles</p>
      </div>
      
      <AppButton
        variant="primary"
        @click="showAddUserModal = true"
        v-if="hasRole(['admin', 'hr'])"
      >
        <i class="fas fa-user-plus mr-2"></i>
        Add User
      </AppButton>
    </div>

    <!-- Users List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">All Users</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 relative">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <i class="fas fa-user text-gray-600"></i>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.firstName }} {{ user.lastName }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getRoleColor(user.role.name)">
                  {{ user.role.name.toUpperCase() }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-3">
                  Edit
                </button>
                <button class="text-red-600 hover:text-red-900" v-if="user.email !== currentUser?.email">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add User Modal -->
    <AddUserModal
      :is-open="showAddUserModal"
      @close="showAddUserModal = false"
      @user-created="handleUserCreated"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  roles: ['admin', 'hr']
})

const { hasRole, user: currentUser } = useAuth()

// Mock users data (in real app this would come from API)
const users = ref([
  {
    _id: '64a1b1234567890123456789',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: { name: 'admin' },
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '64a1b1234567890123456790',
    email: 'hr@example.com',
    firstName: 'HR',
    lastName: 'Manager',
    role: { name: 'hr' },
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '64a1b1234567890123456791',
    email: 'accountant@example.com',
    firstName: 'Finance',
    lastName: 'Manager',
    role: { name: 'accountant' },
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '64a1b1234567890123456792',
    email: 'employee@example.com',
    firstName: 'John',
    lastName: 'Employee',
    role: { name: 'employee' },
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  }
])

const showAddUserModal = ref(false)

const getRoleColor = (role: string) => {
  const colors = {
    admin: 'bg-red-100 text-red-800',
    hr: 'bg-blue-100 text-blue-800',
    accountant: 'bg-green-100 text-green-800',
    employee: 'bg-gray-100 text-gray-800'
  }
  return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleUserCreated = (newUser: any) => {
  users.value.push(newUser)
}

useSeoMeta({
  title: 'User Management - CMS System',
  description: 'Manage system users and roles'
})
</script>