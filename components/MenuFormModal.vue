<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-2xl">
      <form @submit.prevent="handleSubmit">
        <h3 class="font-bold text-lg mb-4">
          {{ isEdit ? 'Edit Menu' : 'Add New Menu' }}
        </h3>

        <div class="space-y-4">
          <!-- Name -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Name <span class="text-error">*</span></span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Enter menu name"
              class="input input-bordered"
              :class="{ 'input-error': errors.name }"
              required
            />
            <label v-if="errors.name" class="label">
              <span class="label-text-alt text-error">{{ errors.name }}</span>
            </label>
          </div>

          <!-- Path -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Path <span class="text-error">*</span></span>
            </label>
            <input
              v-model="form.path"
              type="text"
              placeholder="/dashboard/example"
              class="input input-bordered"
              :class="{ 'input-error': errors.path }"
              required
            />
            <label v-if="errors.path" class="label">
              <span class="label-text-alt text-error">{{ errors.path }}</span>
            </label>
            <label class="label">
              <span class="label-text-alt">Enter the route path for this menu item</span>
            </label>
          </div>

          <!-- Icon -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Icon</span>
            </label>
            <div class="flex space-x-2">
              <input
                v-model="form.icon"
                type="text"
                placeholder="fas fa-home"
                class="input input-bordered flex-1"
              />
              <div class="flex items-center justify-center w-12 h-12 bg-base-200 rounded-lg">
                <i v-if="form.icon" :class="form.icon" class="text-lg"></i>
                <span v-else class="text-base-content/40 text-xs">Icon</span>
              </div>
            </div>
            <label class="label">
              <span class="label-text-alt">FontAwesome icon class (optional)</span>
            </label>
          </div>

          <!-- Parent Menu -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Parent Menu</span>
            </label>
            <select v-model="form.parent" class="select select-bordered">
              <option value="">None (Top Level)</option>
              <option
                v-for="parentMenu in availableParents"
                :key="parentMenu._id"
                :value="parentMenu._id"
              >
                {{ parentMenu.name }}
              </option>
            </select>
            <label class="label">
              <span class="label-text-alt">Select parent menu for nested structure</span>
            </label>
          </div>

          <!-- Roles -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Roles <span class="text-error">*</span></span>
            </label>
            <div class="grid grid-cols-2 gap-2">
              <label v-for="role in availableRoles" :key="role" class="cursor-pointer label justify-start">
                <input
                  v-model="form.roles"
                  type="checkbox"
                  :value="role"
                  class="checkbox checkbox-sm"
                />
                <span class="label-text ml-2 capitalize">{{ role }}</span>
              </label>
            </div>
            <label v-if="errors.roles" class="label">
              <span class="label-text-alt text-error">{{ errors.roles }}</span>
            </label>
          </div>

          <!-- Order -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Display Order</span>
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

          <!-- Active Status -->
          <div class="form-control">
            <label class="cursor-pointer label justify-start">
              <input
                v-model="form.isActive"
                type="checkbox"
                class="checkbox"
              />
              <span class="label-text ml-2">Active</span>
            </label>
            <label class="label">
              <span class="label-text-alt">Inactive menus are hidden from users</span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="modal-action">
          <button type="button" @click="$emit('close')" class="btn btn-ghost">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            {{ loading ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/composables/interfaces/common'

interface Props {
  menu?: MenuItem | null
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

const availableRoles = ['admin', 'hr', 'manager', 'user']

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
const isEdit = computed(() => !!props.menu)

const availableParents = computed(() => {
  return props.menus.filter(menu => {
    // Don't allow self as parent
    if (props.menu && menu._id === props.menu._id) return false
    // Don't allow children as parents (prevent circular references)
    if (props.menu && menu.parent === props.menu._id) return false
    return true
  })
})

// Methods
const resetForm = () => {
  if (props.menu) {
    form.name = props.menu.name
    form.path = props.menu.path
    form.icon = props.menu.icon || ''
    form.parent = props.menu.parent || ''
    form.roles = [...props.menu.roles]
    form.order = props.menu.order
    form.isActive = props.menu.isActive
  } else {
    form.name = ''
    form.path = ''
    form.icon = ''
    form.parent = ''
    form.roles = []
    form.order = props.menus.length
    form.isActive = true
  }
  errors.value = {}
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.name.trim()) {
    errors.value.name = 'Name is required'
  }

  if (!form.path.trim()) {
    errors.value.path = 'Path is required'
  } else if (!form.path.startsWith('/')) {
    errors.value.path = 'Path must start with /'
  }

  if (form.roles.length === 0) {
    errors.value.roles = 'At least one role must be selected'
  }

  // Check for duplicate paths (excluding current menu when editing)
  const existingMenu = props.menus.find(menu => 
    menu.path === form.path && (!props.menu || menu._id !== props.menu._id)
  )
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
    console.error('Error saving menu:', error)
  } finally {
    loading.value = false
  }
}

// Initialize form when menu prop changes
watch(() => props.menu, resetForm, { immediate: true })
</script>