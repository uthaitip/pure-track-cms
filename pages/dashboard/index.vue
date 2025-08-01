<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Dashboard</h1>
      <p class="text-base-content/70 mt-2">Welcome back, {{ user?.firstName }}!</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-figure text-primary">
            <i class="fas fa-users text-2xl"></i>
          </div>
          <div class="stat-title">Total Users</div>
          <div class="stat-value text-primary">1,234</div>
          <div class="stat-desc">↗︎ 400 (22%)</div>
        </div>
      </div>

      <div class="stats shadow">
        <div class="stat">
          <div class="stat-figure text-secondary">
            <i class="fas fa-chart-line text-2xl"></i>
          </div>
          <div class="stat-title">Revenue</div>
          <div class="stat-value text-secondary">$12,345</div>
          <div class="stat-desc">↗︎ $2K (18%)</div>
        </div>
      </div>

      <div class="stats shadow">
        <div class="stat">
          <div class="stat-figure text-accent">
            <i class="fas fa-tasks text-2xl"></i>
          </div>
          <div class="stat-title">Active Tasks</div>
          <div class="stat-value text-accent">56</div>
          <div class="stat-desc">↘︎ 12 (12%)</div>
        </div>
      </div>
    </div>

    <!-- Content Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Activity -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">Recent Activity</h2>
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div class="badge badge-primary badge-sm mt-1"></div>
              <div>
                <p class="text-sm">New user registered</p>
                <p class="text-xs opacity-60">2 minutes ago</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <div class="badge badge-secondary badge-sm mt-1"></div>
              <div>
                <p class="text-sm">Payment received</p>
                <p class="text-xs opacity-60">1 hour ago</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <div class="badge badge-accent badge-sm mt-1"></div>
              <div>
                <p class="text-sm">Task completed</p>
                <p class="text-xs opacity-60">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">Quick Actions</h2>
          <div class="grid grid-cols-2 gap-4">
            <NuxtLink 
              v-if="hasRole(['admin', 'hr'])"
              to="/dashboard/add-user"
              class="btn btn-outline btn-primary flex-col h-20"
            >
              <i class="fas fa-user-plus text-xl"></i>
              <span class="text-xs">Add User</span>
            </NuxtLink>
            
            <button 
              v-if="hasRole(['admin', 'accountant'])"
              class="btn btn-outline btn-secondary flex-col h-20"
            >
              <i class="fas fa-chart-bar text-xl"></i>
              <span class="text-xs">View Reports</span>
            </button>
            
            <button class="btn btn-outline btn-accent flex-col h-20">
              <i class="fas fa-cog text-xl"></i>
              <span class="text-xs">Settings</span>
            </button>
            
            <button class="btn btn-outline btn-info flex-col h-20">
              <i class="fas fa-envelope text-xl"></i>
              <span class="text-xs">Messages</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Role-specific welcome message -->
    <div class="alert alert-info mt-8">
      <i class="fas fa-info-circle"></i>
      <div>
        <h3 class="font-bold">
          Welcome, {{ user?.role.name.charAt(0).toUpperCase() + user?.role.name.slice(1) }}!
        </h3>
        <div class="text-sm">
          <p v-if="user?.role.name === 'admin'">
            You have full system access. Manage users, roles, and system settings.
          </p>
          <p v-else-if="user?.role.name === 'hr'">
            Manage employee data, recruitment, and HR processes.
          </p>
          <p v-else-if="user?.role.name === 'accountant'">
            Handle financial records, reports, and accounting tasks.
          </p>
          <p v-else>
            Welcome to your dashboard. Access your tasks and projects here.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { user, hasRole } = useAuth()

useSeoMeta({
  title: 'Dashboard - CMS System',
  description: 'Your CMS dashboard'
})
</script>