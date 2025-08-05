<template>
  <div class="modal modal-open">
    <form method="dialog" class="modal-backdrop">
      <button @click="$emit('close')">close</button>
    </form>
    <div class="modal-box">
      <h3 class="font-bold text-lg">Add New Menu</h3>
      <form @submit.prevent="handleSubmit">
        <div class="py-4 space-y-4">
          <!-- Name -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Menu Name *</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="e.g., Dashboard"
              class="input input-bordered"
              required
            />
          </div>

          <!-- Path -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Path *</span>
            </label>
            <input
              v-model="form.path"
              type="text"
              placeholder="/dashboard/example"
              class="input input-bordered"
              required
            />
          </div>

          <!-- Icon -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Icon</span>
            </label>
            <input
              v-model="form.icon"
              type="text"
              placeholder="fas fa-home"
              class="input input-bordered"
            />
          </div>

          <!-- Roles -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Roles *</span>
            </label>
            <div class="flex flex-wrap gap-2">
              <label class="cursor-pointer label">
                <input v-model="form.roles" type="checkbox" value="admin" class="checkbox checkbox-sm" />
                <span class="label-text ml-2">Admin</span>
              </label>
              <label class="cursor-pointer label">
                <input v-model="form.roles" type="checkbox" value="hr" class="checkbox checkbox-sm" />
                <span class="label-text ml-2">HR</span>
              </label>
              <label class="cursor-pointer label">
                <input v-model="form.roles" type="checkbox" value="manager" class="checkbox checkbox-sm" />
                <span class="label-text ml-2">Manager</span>
              </label>
              <label class="cursor-pointer label">
                <input v-model="form.roles" type="checkbox" value="user" class="checkbox checkbox-sm" />
                <span class="label-text ml-2">User</span>
              </label>
            </div>
          </div>
        </div>

        <div class="modal-action">
          <button type="button" @click="$emit('close')" class="btn btn-ghost">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
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

const form = reactive({
  name: '',
  path: '',
  icon: '',
  roles: [] as string[],
  order: 0,
  isActive: true
})

const handleSubmit = async () => {
  if (!form.name || !form.path || form.roles.length === 0) {
    alert('Please fill in all required fields')
    return
  }

  loading.value = true
  try {
    emit('save', {
      name: form.name,
      path: form.path,
      icon: form.icon || undefined,
      roles: form.roles,
      order: props.menus.length,
      isActive: form.isActive
    })
  } finally {
    loading.value = false
  }
}
</script>