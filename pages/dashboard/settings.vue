<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-base-content">Settings</h1>
        <p class="text-base-content/60 mt-1">Manage system settings and configurations</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs tabs-bordered">
      <button 
        class="tab tab-bordered"
        :class="{ 'tab-active': activeTab === 'menus' }"
        @click="activeTab = 'menus'"
      >
        Menu Management
      </button>
      <button 
        class="tab tab-bordered"
        :class="{ 'tab-active': activeTab === 'general' }"
        @click="activeTab = 'general'"
      >
        General Settings
      </button>
    </div>

    <!-- Menu Management Tab -->
    <div v-if="activeTab === 'menus'" class="space-y-6">
      <!-- Menu Actions -->
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <div class="form-control">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search menus..."
              class="input input-bordered input-sm w-64"
            />
          </div>
          <select v-model="filterRole" class="select select-bordered select-sm">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="hr">HR</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
        </div>
        <button @click="showAddMenuModal = true" class="btn btn-primary btn-sm">
          <i class="fas fa-plus"></i>
          Add Menu
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="loading loading-spinner loading-lg"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-error">
        <i class="fas fa-exclamation-triangle"></i>
        <span>{{ error }}</span>
        <button @click="fetchMenus()" class="btn btn-sm btn-ghost">
          <i class="fas fa-redo"></i>
          Retry
        </button>
      </div>

      <!-- Menu Table -->
      <div v-else class="overflow-x-auto">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>Name</th>
              <th>Path</th>
              <th>Icon</th>
              <th>Roles</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="menu in filteredMenus" :key="menu._id">
              <td>
                <div class="flex items-center space-x-2">
                  <span v-if="menu.parent" class="text-base-content/40">└─</span>
                  <span class="font-medium">{{ menu.name }}</span>
                </div>
              </td>
              <td>
                <code class="text-sm bg-base-200 px-2 py-1 rounded">{{ menu.path }}</code>
              </td>
              <td>
                <i v-if="menu.icon" :class="menu.icon" class="text-lg"></i>
                <span v-else class="text-base-content/40">No icon</span>
              </td>
              <td>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="role in menu.roles"
                    :key="role"
                    class="badge badge-outline badge-sm"
                  >
                    {{ role }}
                  </span>
                </div>
              </td>
              <td>{{ menu.order }}</td>
              <td>
                <div class="badge" :class="menu.isActive ? 'badge-success' : 'badge-error'">
                  {{ menu.isActive ? 'Active' : 'Inactive' }}
                </div>
              </td>
              <td>
                <div class="flex space-x-2">
                  <button
                    @click="openMenuModal(menu)"
                    class="btn btn-ghost btn-xs"
                    title="Edit"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="confirmDelete(menu)"
                    class="btn btn-ghost btn-xs text-error"
                    title="Delete"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredMenus.length === 0" class="text-center py-8">
          <div class="text-base-content/40">
            <i class="fas fa-search text-4xl mb-4"></i>
            <p>No menus found</p>
          </div>
        </div>
      </div>
    </div>

    <!-- General Settings Tab -->
    <div v-if="activeTab === 'general'" class="space-y-6">
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h2 class="card-title">Application Settings</h2>
          <p class="text-base-content/60">Configure general application settings</p>
          <div class="text-center py-8 text-base-content/40">
            <i class="fas fa-cog text-4xl mb-4"></i>
            <p>General settings coming soon...</p>
          </div>
        </div>
      </div>
    </div>


    <!-- Add Menu Modal -->
    <SimpleAddMenuModal
      v-if="showAddMenuModal"
      :menus="menus"
      @close="showAddMenuModal = false"
      @save="handleAddMenu"
    />

    <!-- Edit Menu Form Modal -->
    <MenuFormModal
      v-if="showMenuModal"
      :menu="selectedMenu"
      :menus="menus"
      @close="closeMenuModal"
      @save="handleMenuSave"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirm Delete</h3>
        <p class="py-4">
          Are you sure you want to delete the menu "{{ menuToDelete?.name }}"?
          This action cannot be undone.
        </p>
        <div class="modal-action">
          <button @click="showDeleteModal = false" class="btn btn-ghost">Cancel</button>
          <button @click="handleDelete" class="btn btn-error" :disabled="deleting">
            <span v-if="deleting" class="loading loading-spinner loading-sm"></span>
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/composables/interfaces/common'
import SimpleAddMenuModal from '~/components/SimpleAddMenuModal.vue'
import MenuFormModal from '~/components/MenuFormModal.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const activeTab = ref('menus')
const searchQuery = ref('')
const filterRole = ref('')
const showAddMenuModal = ref(false)
const showMenuModal = ref(false)
const showDeleteModal = ref(false)
const selectedMenu = ref<MenuItem | null>(null)
const menuToDelete = ref<MenuItem | null>(null)
const deleting = ref(false)

// Use menu composable
const { menus, loading, error, fetchMenus, createMenu, updateMenu, deleteMenu } = useMenu()

// Computed properties
const filteredMenus = computed(() => {
  let filtered = menus.value
  console.log('menu ====>', menus);

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(menu => 
      menu.name.toLowerCase().includes(query) ||
      menu.path.toLowerCase().includes(query)
    )
  }

  // Filter by role
  if (filterRole.value) {
    filtered = filtered.filter(menu => 
      menu.roles.includes(filterRole.value)
    )
  }

  return [...filtered].sort((a: MenuItem, b: MenuItem) => a.order - b.order)
})

// Methods
const openMenuModal = (menu?: MenuItem) => {
  selectedMenu.value = menu || null
  showMenuModal.value = true
}

const closeMenuModal = () => {
  selectedMenu.value = null
  showMenuModal.value = false
}

const handleAddMenu = async (menuData: Partial<MenuItem>) => {
  try {
    await createMenu(menuData)
    showAddMenuModal.value = false
    await fetchMenus(true) // Force refresh
  } catch (error) {
    console.error('Error creating menu:', error)
  }
}

const handleMenuSave = async (menuData: Partial<MenuItem>) => {
  try {
    if (selectedMenu.value) {
      await updateMenu(selectedMenu.value._id, menuData)
    }
    closeMenuModal()
    await fetchMenus(true) // Force refresh
  } catch (error) {
    console.error('Error saving menu:', error)
  }
}

const confirmDelete = (menu: MenuItem) => {
  menuToDelete.value = menu
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!menuToDelete.value) return
  
  deleting.value = true
  try {
    await deleteMenu(menuToDelete.value._id)
    showDeleteModal.value = false
    menuToDelete.value = null
    await fetchMenus(true) // Force refresh
  } catch (error) {
    console.error('Error deleting menu:', error)
  } finally {
    deleting.value = false
  }
}

// Initialize
onMounted(() => {
  fetchMenus()
})
</script>