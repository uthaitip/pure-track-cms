<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Menu Reports</h1>
        <p class="text-base-content/70 mt-2">Analyze menu structure and usage patterns</p>
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
          @click="exportToPDF"
          :disabled="loading || !reportData"
        >
          <i class="fas fa-file-pdf mr-2"></i>
          Export PDF
        </button>
      </div>
    </div>

    <!-- Date Range Filter -->
    <div class="card bg-base-100 shadow mb-6">
      <div class="card-body">
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Start Date</span>
            </label>
            <input
              type="date"
              v-model="startDate"
              class="input input-bordered"
              @change="applyFilters"
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">End Date</span>
            </label>
            <input
              type="date"
              v-model="endDate"
              class="input input-bordered"
              @change="applyFilters"
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">Quick Filters</span>
            </label>
            <div class="flex gap-2">
              <button 
                class="btn btn-sm btn-outline"
                @click="setDateRange('7d')"
              >
                Last 7 Days
              </button>
              <button 
                class="btn btn-sm btn-outline"
                @click="setDateRange('30d')"
              >
                Last 30 Days
              </button>
              <button 
                class="btn btn-sm btn-outline"
                @click="setDateRange('all')"
              >
                All Time
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card bg-base-100 shadow">
      <div class="card-body">
        <div class="flex items-center justify-center py-12">
          <div class="loading loading-spinner loading-lg"></div>
          <span class="ml-4">Loading menu reports...</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error">
      <i class="fas fa-exclamation-triangle"></i>
      <div>
        <h3 class="font-bold">Error loading menu reports</h3>
        <div class="text-sm">{{ error }}</div>
      </div>
      <button class="btn btn-ghost btn-sm" @click="refreshReports">
        <i class="fas fa-redo mr-2"></i>
        Retry
      </button>
    </div>

    <!-- Reports Content -->
    <div v-else-if="reportData" class="space-y-6">
      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="stats shadow">
          <div class="stat">
            <div class="stat-figure text-primary">
              <i class="fas fa-list text-2xl"></i>
            </div>
            <div class="stat-title">Total Menus</div>
            <div class="stat-value text-primary">{{ reportData.summary.totalMenus }}</div>
          </div>
        </div>

        <div class="stats shadow">
          <div class="stat">
            <div class="stat-figure text-success">
              <i class="fas fa-check-circle text-2xl"></i>
            </div>
            <div class="stat-title">Active</div>
            <div class="stat-value text-success">{{ reportData.summary.activeMenus }}</div>
          </div>
        </div>

        <div class="stats shadow">
          <div class="stat">
            <div class="stat-figure text-error">
              <i class="fas fa-times-circle text-2xl"></i>
            </div>
            <div class="stat-title">Inactive</div>
            <div class="stat-value text-error">{{ reportData.summary.inactiveMenus }}</div>
          </div>
        </div>

        <div class="stats shadow">
          <div class="stat">
            <div class="stat-figure text-info">
              <i class="fas fa-sitemap text-2xl"></i>
            </div>
            <div class="stat-title">Parent Menus</div>
            <div class="stat-value text-info">{{ reportData.summary.parentMenus }}</div>
          </div>
        </div>

        <div class="stats shadow">
          <div class="stat">
            <div class="stat-figure text-warning">
              <i class="fas fa-code-branch text-2xl"></i>
            </div>
            <div class="stat-title">Child Menus</div>
            <div class="stat-value text-warning">{{ reportData.summary.childMenus }}</div>
          </div>
        </div>
      </div>

      <!-- Role Distribution -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">Menu Distribution by Role</h2>
            <div class="space-y-3">
              <div 
                v-for="(stats, role) in reportData.roleStats" 
                :key="role"
                class="flex items-center justify-between p-3 bg-base-200 rounded"
              >
                <div>
                  <div class="font-semibold capitalize">{{ role }}</div>
                  <div class="text-sm opacity-60">{{ stats.active }} active, {{ stats.inactive }} inactive</div>
                </div>
                <div class="text-right">
                  <div class="font-semibold">{{ stats.total }}</div>
                  <div class="text-sm opacity-60">
                    {{ ((stats.total / reportData.summary.totalMenus) * 100).toFixed(1) }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Monthly Trends -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">Monthly Menu Creation</h2>
            <div class="space-y-3">
              <div 
                v-for="(stats, month) in reportData.monthlyStats" 
                :key="month"
                class="flex items-center justify-between p-3 bg-base-200 rounded"
              >
                <div>
                  <div class="font-semibold">{{ formatMonth(month) }}</div>
                  <div class="text-sm opacity-60">{{ stats.active }} active, {{ stats.inactive }} inactive</div>
                </div>
                <div class="text-right">
                  <div class="font-semibold">{{ stats.total }}</div>
                  <div class="text-sm opacity-60">menus created</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Menus -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">Recent Menus</h2>
          <div class="overflow-x-auto">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Path</th>
                  <th>Status</th>
                  <th>Roles</th>
                  <th>Created</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="menu in reportData.recentMenus" :key="menu._id">
                  <td class="font-semibold">{{ menu.name }}</td>
                  <td>
                    <code class="text-xs bg-base-200 px-2 py-1 rounded">{{ menu.path }}</code>
                  </td>
                  <td>
                    <span 
                      :class="[
                        'badge badge-sm',
                        menu.isActive ? 'badge-success' : 'badge-error'
                      ]"
                    >
                      {{ menu.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <div class="flex gap-1 flex-wrap">
                      <span 
                        v-for="role in menu.roles" 
                        :key="role"
                        class="badge badge-outline badge-xs"
                      >
                        {{ role }}
                      </span>
                    </div>
                  </td>
                  <td class="text-sm opacity-60">
                    {{ formatDate(menu.createdAt) }}
                  </td>
                  <td class="text-sm opacity-60">
                    {{ formatDate(menu.updatedAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- All Menus Table -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">All Menus</h2>
          <div class="overflow-x-auto">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Path</th>
                  <th>Icon</th>
                  <th>Status</th>
                  <th>Roles</th>
                  <th>Parent</th>
                  <th>Order</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="menu in reportData.allMenus" :key="menu._id">
                  <td class="font-semibold">{{ menu.name }}</td>
                  <td>
                    <code class="text-xs bg-base-200 px-2 py-1 rounded">{{ menu.path }}</code>
                  </td>
                  <td>
                    <i v-if="menu.icon" :class="menu.icon" class="text-base-content/60"></i>
                    <span v-else class="text-base-content/40">-</span>
                  </td>
                  <td>
                    <span 
                      :class="[
                        'badge badge-sm',
                        menu.isActive ? 'badge-success' : 'badge-error'
                      ]"
                    >
                      {{ menu.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <div class="flex gap-1 flex-wrap">
                      <span 
                        v-for="role in menu.roles" 
                        :key="role"
                        class="badge badge-outline badge-xs"
                      >
                        {{ role }}
                      </span>
                    </div>
                  </td>
                  <td class="text-sm opacity-60">
                    {{ menu.parent || '-' }}
                  </td>
                  <td class="text-sm">{{ menu.order }}</td>
                  <td class="text-sm opacity-60">
                    {{ formatDate(menu.createdAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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

interface MenuReportData {
  summary: {
    totalMenus: number
    activeMenus: number
    inactiveMenus: number
    parentMenus: number
    childMenus: number
  }
  roleStats: Record<string, { total: number; active: number; inactive: number }>
  monthlyStats: Record<string, { total: number; active: number; inactive: number }>
  recentMenus: Array<{
    _id: string
    name: string
    path: string
    isActive: boolean
    roles: string[]
    createdAt?: string
    updatedAt?: string
  }>
  allMenus: Array<{
    _id: string
    name: string
    path: string
    icon?: string
    roles: string[]
    parent?: string
    order: number
    isActive: boolean
    createdAt?: string
    updatedAt?: string
  }>
  filters: {
    startDate?: string
    endDate?: string
  }
}

// State
const reportData = ref<MenuReportData | null>(null)
const loading = ref(false)
const error = ref('')
const startDate = ref('')
const endDate = ref('')

// Methods
const refreshReports = async () => {
  await fetchReports()
}

const fetchReports = async () => {
  const { token } = useAuth()
  
  if (!token.value) {
    error.value = 'Authentication required'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams()
    if (startDate.value) params.append('startDate', startDate.value)
    if (endDate.value) params.append('endDate', endDate.value)
    
    const queryString = params.toString()
    const url = `/api/menus/reports${queryString ? '?' + queryString : ''}`

    const { data } = await $fetch<{
      success: boolean
      data: MenuReportData
    }>(url, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    reportData.value = data
  } catch (err: any) {
    console.error('Fetch menu reports error:', err)
    error.value = err.data?.statusMessage || 'Failed to fetch menu reports'
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  fetchReports()
}

const setDateRange = (range: string) => {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  
  endDate.value = today
  
  switch (range) {
    case '7d':
      const week = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      startDate.value = week.toISOString().split('T')[0]
      break
    case '30d':
      const month = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      startDate.value = month.toISOString().split('T')[0]
      break
    case 'all':
      startDate.value = ''
      endDate.value = ''
      break
  }
  
  fetchReports()
}

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

const formatMonth = (monthStr: string): string => {
  const [year, month] = monthStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

const exportToPDF = async () => {
  if (!reportData.value) return
  
  try {
    // Import jsPDF dynamically
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(20)
    doc.text('Menu Reports', 20, 20)
    
    // Date range
    const dateRange = reportData.value.filters.startDate && reportData.value.filters.endDate
      ? `${formatDate(reportData.value.filters.startDate)} - ${formatDate(reportData.value.filters.endDate)}`
      : 'All Time'
    
    doc.setFontSize(12)
    doc.text(`Report Period: ${dateRange}`, 20, 30)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40)
    
    // Summary stats
    doc.setFontSize(16)
    doc.text('Summary Statistics', 20, 55)
    
    doc.setFontSize(12)
    let yPos = 65
    doc.text(`Total Menus: ${reportData.value.summary.totalMenus}`, 20, yPos)
    yPos += 10
    doc.text(`Active Menus: ${reportData.value.summary.activeMenus}`, 20, yPos)
    yPos += 10
    doc.text(`Inactive Menus: ${reportData.value.summary.inactiveMenus}`, 20, yPos)
    yPos += 10
    doc.text(`Parent Menus: ${reportData.value.summary.parentMenus}`, 20, yPos)
    yPos += 10
    doc.text(`Child Menus: ${reportData.value.summary.childMenus}`, 20, yPos)
    
    // Role distribution
    yPos += 20
    doc.setFontSize(16)
    doc.text('Menu Distribution by Role', 20, yPos)
    yPos += 15
    
    doc.setFontSize(12)
    Object.entries(reportData.value.roleStats).forEach(([role, stats]) => {
      doc.text(`${role.charAt(0).toUpperCase() + role.slice(1)}: ${stats.total} total (${stats.active} active, ${stats.inactive} inactive)`, 20, yPos)
      yPos += 10
    })
    
    // Recent menus table
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }
    
    yPos += 10
    doc.setFontSize(16)
    doc.text('Recent Menus', 20, yPos)
    yPos += 15
    
    doc.setFontSize(10)
    reportData.value.recentMenus.slice(0, 10).forEach((menu) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      
      doc.text(`${menu.name} - ${menu.path} - ${menu.isActive ? 'Active' : 'Inactive'} - Roles: ${menu.roles.join(', ')}`, 20, yPos)
      yPos += 8
    })
    
    // Save the PDF
    doc.save(`menu-reports-${new Date().toISOString().split('T')[0]}.pdf`)
  } catch (err) {
    console.error('Export to PDF error:', err)
    error.value = 'Failed to export PDF'
  }
}

// Fetch reports on mount
onMounted(() => {
  fetchReports()
})

useSeoMeta({
  title: 'Menu Reports - CMS System',
  description: 'Analyze menu structure and usage patterns'
})
</script>