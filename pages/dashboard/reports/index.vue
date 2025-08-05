<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Reports & Analytics</h1>
        <p class="text-base-content/70 mt-2">Track performance and generate insights</p>
      </div>
      
      <div class="flex gap-2">
        <button
          class="btn btn-ghost"
          @click="refreshReports"
          :disabled="loading"
        >
          <span v-if="loading" class="loading loading-spinner loading-sm"></span>
          <i class="fas fa-refresh mr-2"></i>
          Refresh
        </button>
        
        <button
          class="btn btn-primary"
          @click="exportReport"
        >
          <i class="fas fa-download mr-2"></i>
          Export
        </button>
      </div>
    </div>

    <!-- Time Range Filter -->
    <div class="card bg-base-100 shadow mb-6">
      <div class="card-body">
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Time Range</span>
            </label>
            <select
              v-model="selectedTimeRange"
              class="select select-bordered"
              @change="applyFilters"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">Report Type</span>
            </label>
            <select
              v-model="selectedReportType"
              class="select select-bordered"
              @change="applyFilters"
            >
              <option value="sales">Sales Report</option>
              <option value="products">Product Performance</option>
              <option value="customers">Customer Analytics</option>
              <option value="revenue">Revenue Analysis</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card bg-base-100 shadow">
      <div class="card-body">
        <div class="flex items-center justify-center py-12">
          <div class="loading loading-spinner loading-lg"></div>
          <span class="ml-4">Loading reports...</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error">
      <i class="fas fa-exclamation-triangle"></i>
      <div>
        <h3 class="font-bold">Error loading reports</h3>
        <div class="text-sm">{{ error }}</div>
      </div>
      <button class="btn btn-ghost btn-sm">
        <i class="fas fa-redo mr-2"></i>
        Retry
      </button>
    </div>

    <!-- Reports Content -->
    <div v-else class="space-y-6">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="stats shadow">
          <div class="stat">
            <div class="stat-figure text-primary">
              <i class="fas fa-chart-line text-2xl"></i>
            </div>
            <div class="stat-title">Total Revenue</div>
            <div class="stat-value text-primary">${{ formatNumber(reports.totalRevenue) }}</div>
            <div class="stat-desc">
              <span :class="reports.revenueTrend >= 0 ? 'text-success' : 'text-error'">
                <i :class="reports.revenueTrend >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                {{ Math.abs(reports.revenueTrend) }}%
              </span>
              vs previous period
            </div>
          </div>
        </div>

        <div class="stats shadow">
          <div class="stat">
            <div class="stat-figure text-secondary">
              <i class="fas fa-shopping-cart text-2xl"></i>
            </div>
            <div class="stat-title">Orders</div>
            <div class="stat-value text-secondary">{{ reports.totalOrders }}</div>
            <div class="stat-desc">
              <span :class="reports.ordersTrend >= 0 ? 'text-success' : 'text-error'">
                <i :class="reports.ordersTrend >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                {{ Math.abs(reports.ordersTrend) }}%
              </span>
              vs previous period
            </div>
          </div>
        </div>

        <div class="stats shadow">
          <div class="stat">
            <div class="stat-figure text-accent">
              <i class="fas fa-users text-2xl"></i>
            </div>
            <div class="stat-title">Customers</div>
            <div class="stat-value text-accent">{{ reports.totalCustomers }}</div>
            <div class="stat-desc">
              <span :class="reports.customersTrend >= 0 ? 'text-success' : 'text-error'">
                <i :class="reports.customersTrend >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                {{ Math.abs(reports.customersTrend) }}%
              </span>
              vs previous period
            </div>
          </div>
        </div>

        <div class="stats shadow">
          <div class="stat">
            <div class="stat-figure text-success">
              <i class="fas fa-dollar-sign text-2xl"></i>
            </div>
            <div class="stat-title">Avg Order Value</div>
            <div class="stat-value text-success">${{ formatNumber(reports.avgOrderValue) }}</div>
            <div class="stat-desc">
              <span :class="reports.avgOrderTrend >= 0 ? 'text-success' : 'text-error'">
                <i :class="reports.avgOrderTrend >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                {{ Math.abs(reports.avgOrderTrend) }}%
              </span>
              vs previous period
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue Chart -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">Revenue Trend</h2>
            <div class="h-64 flex items-center justify-center bg-base-200 rounded">
              <div class="text-center">
                <i class="fas fa-chart-area text-4xl text-base-content/30 mb-4"></i>
                <p class="text-base-content/60">Chart visualization would go here</p>
                <p class="text-sm text-base-content/40">Integration with Chart.js or similar</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Products -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">Top Products</h2>
            <div class="space-y-3">
              <div 
                v-for="product in reports.topProducts" 
                :key="product.id"
                class="flex items-center justify-between p-3 bg-base-200 rounded"
              >
                <div>
                  <div class="font-semibold">{{ product.name }}</div>
                  <div class="text-sm opacity-60">{{ product.sales }} sold</div>
                </div>
                <div class="text-right">
                  <div class="font-semibold">${{ formatNumber(product.revenue) }}</div>
                  <div class="text-sm opacity-60">{{ product.percentage }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Sales by Category -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">Sales by Category</h2>
            <div class="overflow-x-auto">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Sales</th>
                    <th>Revenue</th>
                    <th>Growth</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="category in reports.salesByCategory" :key="category.name">
                    <td>{{ category.name }}</td>
                    <td>{{ category.sales }}</td>
                    <td>${{ formatNumber(category.revenue) }}</td>
                    <td>
                      <span :class="category.growth >= 0 ? 'text-success' : 'text-error'">
                        <i :class="category.growth >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                        {{ Math.abs(category.growth) }}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Customer Insights -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">Customer Insights</h2>
            <div class="space-y-4">
              <div class="stat">
                <div class="stat-title">New Customers</div>
                <div class="stat-value text-sm">{{ reports.newCustomers }}</div>
                <div class="stat-desc">This period</div>
              </div>
              <div class="stat">
                <div class="stat-title">Returning Customers</div>
                <div class="stat-value text-sm">{{ reports.returningCustomers }}</div>
                <div class="stat-desc">{{ ((reports.returningCustomers / reports.totalCustomers) * 100).toFixed(1) }}% of total</div>
              </div>
              <div class="stat">
                <div class="stat-title">Customer Lifetime Value</div>
                <div class="stat-value text-sm">${{ formatNumber(reports.customerLifetimeValue) }}</div>
                <div class="stat-desc">Average per customer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReports } from '~/composables/api/useReports'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { 
  reports, 
  loading, 
  error, 
  fetchReports
} = useReports()

// Local state
const selectedTimeRange = ref('30d')
const selectedReportType = ref('sales')

// Methods
const refreshReports = () => {
  fetchReports({ 
    timeRange: selectedTimeRange.value,
    type: selectedReportType.value 
  })
}

const applyFilters = () => {
  fetchReports({ 
    timeRange: selectedTimeRange.value,
    type: selectedReportType.value 
  })
}

const exportReport = () => {
  // TODO: Implement export functionality
  console.log('Export report:', selectedReportType.value, selectedTimeRange.value)
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toLocaleString()
}

// Fetch reports on mount
onMounted(() => {
  fetchReports({ 
    timeRange: selectedTimeRange.value,
    type: selectedReportType.value 
  })
})

useSeoMeta({
  title: 'Reports & Analytics - CMS System',
  description: 'Track performance and generate business insights'
})
</script>