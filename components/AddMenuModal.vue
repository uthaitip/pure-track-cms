<template>
  <div class="modal modal-open">
    <form method="dialog" class="modal-backdrop">
      <button @click="$emit('close')">close</button>
    </form>
    <div class="modal-box max-w-2xl">
      <form @submit.prevent="handleSubmit">
        <h3 class="font-bold text-lg mb-4 flex items-center">
          <i class="fas fa-plus-circle text-primary mr-2"></i>
          Add New Menu
        </h3>

        <div class="space-y-4">
          <!-- Name -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Menu Name <span class="text-error">*</span></span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="e.g., Dashboard, Reports"
              class="input input-bordered"
              :class="{ 'input-error': errors.name }"
              required
              autofocus
            />
            <label v-if="errors.name" class="label">
              <span class="label-text-alt text-error">{{ errors.name }}</span>
            </label>
          </div>

          <!-- Path -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Menu Path <span class="text-error">*</span></span>
            </label>
            <input
              v-model="form.path"
              type="text"
              placeholder="/dashboard/example"
              class="input input-bordered font-mono"
              :class="{ 'input-error': errors.path }"
              required
            />
            <label v-if="errors.path" class="label">
              <span class="label-text-alt text-error">{{ errors.path }}</span>
            </label>
            <label class="label">
              <span class="label-text-alt">Path must start with "/" (e.g., /dashboard/settings)</span>
            </label>
          </div>

          <!-- Icon with Preview -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Icon (Optional)</span>
            </label>
            <div class="flex space-x-3">
              <div class="flex-1">
                <input
                  v-model="form.icon"
                  type="text"
                  placeholder="fas fa-home"
                  class="input input-bordered w-full font-mono"
                />
                <label class="label">
                  <span class="label-text-alt">FontAwesome class (e.g., fas fa-chart-bar)</span>
                </label>
              </div>
              <div class="flex items-center justify-center w-16 h-16 bg-base-200 rounded-lg border-2 border-dashed border-base-300">
                <i v-if="form.icon" :class="form.icon" class="text-2xl text-primary"></i>
                <span v-else class="text-base-content/40 text-xs">Preview</span>
              </div>
            </div>
          </div>

          <!-- Quick Icon Selection -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Quick Icon Selection</span>
            </label>
            <div class="grid grid-cols-8 gap-2 p-4 bg-base-100 rounded-lg border">
              <button
                v-for="icon in quickIcons"
                :key="icon.class"
                type="button"
                @click="form.icon = icon.class"
                class="btn btn-ghost btn-sm aspect-square p-1"
                :class="{ 'btn-primary': form.icon === icon.class }"
                :title="icon.name"
              >
                <i :class="icon.class" class="text-lg"></i>
              </button>
            </div>
          </div>

          <!-- Parent Menu -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Parent Menu</span>
            </label>
            <select v-model="form.parent" class="select select-bordered">
              <option value="">None (Top Level Menu)</option>
              <option
                v-for="parentMenu in availableParents"
                :key="parentMenu._id"
                :value="parentMenu._id"
              >
                {{ parentMenu.name }}
              </option>
            </select>
            <label class="label">
              <span class="label-text-alt">Choose a parent menu to create a submenu</span>
            </label>
          </div>

          <!-- Roles -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Access Roles <span class="text-error">*</span></span>
            </label>
            <div class="grid grid-cols-2 gap-3 p-4 bg-base-100 rounded-lg border">
              <label v-for="role in availableRoles" :key="role.value" class="cursor-pointer">
                <div class="flex items-center space-x-3 p-2 rounded hover:bg-base-200">
                  <input
                    v-model="form.roles"
                    type="checkbox"
                    :value="role.value"
                    class="checkbox checkbox-primary"
                  />
                  <div class="flex items-center space-x-2">
                    <i :class="role.icon" class="text-sm" :style="{ color: role.color }"></i>
                    <span class="font-medium capitalize">{{ role.label }}</span>
                  </div>
                </div>
              </label>
            </div>
            <label v-if="errors.roles" class="label">
              <span class="label-text-alt text-error">{{ errors.roles }}</span>
            </label>
          </div>

          <!-- Order and Status -->
          <div class="grid grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Display Order</span>
              </label>
              <input
                v-model.number="form.order"
                type="number"
                min="0"
                placeholder="0"
                class="input input-bordered"
              />
              <label class="label">
                <span class="label-text-alt">Lower numbers appear first</span>
              </label>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Status</span>
              </label>
              <label class="cursor-pointer flex items-center space-x-3 p-3 bg-base-100 rounded-lg border">
                <input
                  v-model="form.isActive"
                  type="checkbox"
                  class="toggle toggle-primary"
                />
                <div class="flex items-center space-x-2">
                  <i class="fas fa-eye" :class="form.isActive ? 'text-success' : 'text-error'"></i>
                  <span class="font-medium">{{ form.isActive ? 'Active' : 'Inactive' }}</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="modal-action mt-6">
          <button type="button" @click="$emit('close')" class="btn btn-ghost">
            <i class="fas fa-times mr-2"></i>
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner loading-sm mr-2"></span>
            <i v-else class="fas fa-plus mr-2"></i>
            {{ loading ? 'Creating...' : 'Create Menu' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/composables/interfaces/common'

interface Props {
  menus: MenuItem[]
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: Partial<MenuItem>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)
const errors = ref<Record<string, string>>({})

const availableRoles = [
  { value: 'admin', label: 'Administrator', icon: 'fas fa-crown', color: '#dc2626' },
  { value: 'hr', label: 'HR Manager', icon: 'fas fa-users', color: '#2563eb' },
  { value: 'manager', label: 'Manager', icon: 'fas fa-user-tie', color: '#7c3aed' },
  { value: 'user', label: 'User', icon: 'fas fa-user', color: '#16a34a' }
]

const quickIcons = [
  { name: 'Dashboard', class: 'fas fa-tachometer-alt' },
  { name: 'Users', class: 'fas fa-users' },
  { name: 'Products', class: 'fas fa-box' },
  { name: 'Orders', class: 'fas fa-shopping-cart' },
  { name: 'Reports', class: 'fas fa-chart-bar' },
  { name: 'Settings', class: 'fas fa-cog' },
  { name: 'Analytics', class: 'fas fa-chart-line' },
  { name: 'Finance', class: 'fas fa-dollar-sign' },
  { name: 'Inventory', class: 'fas fa-warehouse' },
  { name: 'Support', class: 'fas fa-headset' },
  { name: 'Security', class: 'fas fa-shield-alt' },
  { name: 'Notifications', class: 'fas fa-bell' },
  { name: 'Calendar', class: 'fas fa-calendar' },
  { name: 'Messages', class: 'fas fa-envelope' },
  { name: 'Files', class: 'fas fa-folder' },
  { name: 'Profile', class: 'fas fa-user-circle' }
]

// Form data
const form = reactive({
  name: '',
  path: '',
  icon: '',
  parent: '',
  roles: [] as string[],
  order: 0,
  isActive: true
})

// Computed
const availableParents = computed(() => {
  return props.menus.filter(menu => !menu.parent) // Only top-level menus can be parents
})

// Methods
const resetForm = () => {
  form.name = ''
  form.path = ''
  form.icon = ''
  form.parent = ''
  form.roles = []
  form.order = props.menus.length
  form.isActive = true
  errors.value = {}
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.name.trim()) {
    errors.value.name = 'Menu name is required'
  }

  if (!form.path.trim()) {
    errors.value.path = 'Menu path is required'
  } else if (!form.path.startsWith('/')) {
    errors.value.path = 'Path must start with /'
  }

  if (form.roles.length === 0) {
    errors.value.roles = 'At least one role must be selected'
  }

  // Check for duplicate paths
  const existingMenu = props.menus.find(menu => menu.path === form.path)
  if (existingMenu) {
    errors.value.path = 'This path is already used by another menu'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    const menuData: Partial<MenuItem> = {
      name: form.name.trim(),
      path: form.path.trim(),
      icon: form.icon.trim() || undefined,
      parent: form.parent || undefined,
      roles: form.roles,
      order: form.order,
      isActive: form.isActive
    }

    emit('save', menuData)
  } catch (error) {
    console.error('Error creating menu:', error)
  } finally {
    loading.value = false
  }
}

// Initialize form
onMounted(() => {
  resetForm()
})
</script>