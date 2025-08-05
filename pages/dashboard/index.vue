<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Dashboard Overview</h1>
      <p class="text-base-content/70 mt-2">Welcome back, {{ user?.firstName }}!</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <DashboardCard
        title="Total Users"
        :value="dashboardStats.users"
        icon="fas fa-users"
        color="primary"
        :trend="dashboardStats.usersTrend"
      />
      
      <DashboardCard
        title="Products"
        :value="dashboardStats.products"
        icon="fas fa-box"
        color="secondary"
        :trend="dashboardStats.productsTrend"
      />
      
      <DashboardCard
        title="Orders"
        :value="dashboardStats.orders"
        icon="fas fa-shopping-cart"
        color="accent"
        :trend="dashboardStats.ordersTrend"
      />
      
      <DashboardCard
        title="Revenue"
        :value="`$${dashboardStats.revenue.toLocaleString()}`"
        icon="fas fa-chart-line"
        color="success"
        :trend="dashboardStats.revenueTrend"
      />
    </div>

    <!-- Quick Actions Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Navigation Cards -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">Management</h2>
          <div class="grid grid-cols-2 gap-4">
            <NuxtLink 
              to="/dashboard/users"
              class="btn btn-outline btn-primary flex-col h-20"
              v-if="hasRole(['admin', 'hr'])"
            >
              <i class="fas fa-users text-xl"></i>
              <span class="text-xs">Users</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/dashboard/products"
              class="btn btn-outline btn-secondary flex-col h-20"
            >
              <i class="fas fa-box text-xl"></i>
              <span class="text-xs">Products</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/dashboard/orders"
              class="btn btn-outline btn-accent flex-col h-20"
            >
              <i class="fas fa-shopping-cart text-xl"></i>
              <span class="text-xs">Orders</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/dashboard/reports"
              class="btn btn-outline btn-info flex-col h-20"
              v-if="hasRole(['admin', 'accountant'])"
            >
              <i class="fas fa-chart-bar text-xl"></i>
              <span class="text-xs">Reports</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">Recent Activity</h2>
          <div class="space-y-4" v-if="recentActivity.length > 0">
            <div 
              v-for="activity in recentActivity" 
              :key="activity.id"
              class="flex items-start space-x-3"
            >
              <div 
                class="badge badge-sm mt-1"
                :class="`badge-${activity.type}`"
              ></div>
              <div>
                <p class="text-sm">{{ activity.message }}</p>
                <p class="text-xs opacity-60">{{ formatRelativeTime(activity.timestamp) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-base-content/60">
            <i class="fas fa-clock text-2xl mb-2"></i>
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Role-specific Information -->
    <div class="alert alert-info">
      <i class="fas fa-info-circle"></i>
      <div>
        <h3 class="font-bold">
          Welcome, {{ user?.role?.name ? user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1) : 'User' }}!
        </h3>
        <div class="text-sm">
          <p v-if="user?.role.name === 'admin'">
            You have full system access. Navigate to different sections using the menu.
          </p>
          <p v-else-if="user?.role.name === 'hr'">
            Manage users and HR operations from the navigation menu.
          </p>
          <p v-else-if="user?.role.name === 'accountant'">
            Access financial reports and order management from the sidebar.
          </p>
          <p v-else>
            Welcome to your dashboard. Use the navigation to access available features.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboard } from '~/composables/api/useDashboard'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { user, hasRole } = useAuth()
const { dashboardStats, recentActivity, fetchDashboardData } = useDashboard()

// Format relative time
const formatRelativeTime = (timestamp: string) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffMs = now.getTime() - time.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return time.toLocaleDateString()
}

// Fetch dashboard data on mount
onMounted(() => {
  fetchDashboardData()
})

useSeoMeta({
  title: 'Dashboard Overview - CMS System',
  description: 'Dashboard overview with statistics and quick actions'
})
</script>