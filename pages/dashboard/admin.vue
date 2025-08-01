<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Admin Panel</h1>
      <p class="text-gray-600 mt-2">System administration and management</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Admin Stats -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <i class="fas fa-users-cog text-white text-sm"></i>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Users</p>
            <p class="text-2xl font-semibold text-gray-900">2,547</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <i class="fas fa-user-shield text-white text-sm"></i>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Roles</p>
            <p class="text-2xl font-semibold text-gray-900">4</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <i class="fas fa-key text-white text-sm"></i>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Permissions</p>
            <p class="text-2xl font-semibold text-gray-900">24</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <i class="fas fa-server text-white text-sm"></i>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">System Health</p>
            <p class="text-2xl font-semibold text-green-600">Good</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- System Management -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">System Management</h2>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <button class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center space-x-3">
                <i class="fas fa-users text-blue-500"></i>
                <span class="font-medium">Manage Users</span>
              </div>
              <i class="fas fa-chevron-right text-gray-400"></i>
            </button>
            
            <button class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center space-x-3">
                <i class="fas fa-user-shield text-green-500"></i>
                <span class="font-medium">Manage Roles</span>
              </div>
              <i class="fas fa-chevron-right text-gray-400"></i>
            </button>
            
            <button class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center space-x-3">
                <i class="fas fa-key text-yellow-500"></i>
                <span class="font-medium">Manage Permissions</span>
              </div>
              <i class="fas fa-chevron-right text-gray-400"></i>
            </button>
            
            <button class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center space-x-3">
                <i class="fas fa-bars text-purple-500"></i>
                <span class="font-medium">Manage Menus</span>
              </div>
              <i class="fas fa-chevron-right text-gray-400"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Admin Actions -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Recent Admin Actions</h2>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p class="text-sm text-gray-900">User account deactivated</p>
                <p class="text-xs text-gray-500">john.doe@example.com - 5 minutes ago</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p class="text-sm text-gray-900">New role created</p>
                <p class="text-xs text-gray-500">Manager role - 1 hour ago</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p class="text-sm text-gray-900">Permission updated</p>
                <p class="text-xs text-gray-500">view_reports permission - 3 hours ago</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p class="text-sm text-gray-900">System backup completed</p>
                <p class="text-xs text-gray-500">Daily backup - 6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  roles: 'admin'
})

useSeoMeta({
  title: 'Admin Panel - CMS System',
  description: 'System administration panel'
})
</script>