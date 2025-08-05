<template>
  <aside class="menu w-64 min-h-full bg-base-100 text-base-content">
    <!-- User Profile -->
    <div class="px-4 text-2xl font-bold">PureTrack Demo</div>
    <div class="p-4 border-b border-base-300">
      <div class="flex items-center space-x-3">
        <div class="avatar placeholder">
          <div class="bg-primary text-center text-primary-content rounded-full w-10 h-10 p-2 flex items-center justify-center">
            <span v-if="user" class="text-center">{{ user.firstName?.charAt(0) }}{{ user.lastName?.charAt(0) }}</span>
            <span v-else>?</span>
          </div>
        </div>
        <div v-if="user">
          <div class="font-semibold">{{ user.firstName }} {{ user.lastName }}</div>
          <div class="badge badge-secondary badge-sm">{{ user.role.name.toUpperCase() }}</div>
        </div>
      </div>
    </div>

    <!-- Menu Items -->
    <ul class="p-2">
      <!-- Loading state -->
      <li v-if="loading">
        <div class="flex items-center space-x-3 p-2">
          <div class="loading loading-spinner loading-sm"></div>
          <span>Loading menus...</span>
        </div>
      </li>

      <!-- Error state -->
      <li v-else-if="error">
        <div class="alert alert-error alert-sm">
          <i class="fas fa-exclamation-triangle"></i>
          <span>{{ error }}</span>
        </div>
      </li>

      <!-- No menus state -->
      <li v-else-if="userMenus.length === 0 && user">
        <div class="text-base-content/60 p-2">No menu items available</div>
      </li>

      <!-- Menu items -->
      <template v-for="menu in userMenus" :key="menu._id">
        <li v-if="menu.children.length === 0">
          <NuxtLink :to="menu.path" class="flex items-center space-x-3">
            <i v-if="menu.icon" :class="menu.icon"></i>
            <span v-else class="w-4 h-4 bg-base-300 rounded"></span>
            <span>{{ menu.name }}</span>
          </NuxtLink>
        </li>

        <!-- Nested menu with children -->
        <li v-else>
          <details :open="openSubmenus.includes(menu._id)">
            <summary @click="toggleSubmenu(menu._id)">
              <i v-if="menu.icon" :class="menu.icon"></i>
              <span v-else class="w-4 h-4 bg-base-300 rounded"></span>
              <span>{{ menu.name }}</span>
            </summary>
            <ul>
              <li v-for="child in menu.children" :key="child._id">
                <NuxtLink :to="child.path" class="flex items-center space-x-3">
                  <i v-if="child.icon" :class="child.icon" class="text-sm"></i>
                  <span v-else class="w-3 h-3 bg-base-300 rounded"></span>
                  <span>{{ child.name }}</span>
                </NuxtLink>
              </li>
            </ul>
          </details>
        </li>
      </template>
    </ul>

    <!-- Logout Button -->
    <div class="p-4 border-t border-base-300 mt-auto">
      <button @click="handleLogout" class="btn btn-error btn-outline btn-sm w-full">
        <i class="fas fa-sign-out-alt"></i>
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/api/useAuth'
import { useMenu } from '~/composables/api/useMenu'

const { user, logout } = useAuth()
const { menus, fetchMenus, loading, error } = useMenu()

const openSubmenus = ref<string[]>([])

const userMenus = computed(() => {
  if (!user.value?.role?.name) return []

  return menus.value.filter(menu =>
    menu.roles.includes(user.value!.role.name) && menu.isActive
  ).sort((a, b) => a.order - b.order)
})

const toggleSubmenu = (menuId: string) => {
  const index = openSubmenus.value.indexOf(menuId)
  if (index > -1) {
    openSubmenus.value.splice(index, 1)
  } else {
    openSubmenus.value.push(menuId)
  }
}

const handleLogout = async () => {
  await logout()
}

// Initialize menus when user role is available
watch(user, (newUser) => {
  if (newUser?.role?.name) {
    fetchMenus()
  }
}, { immediate: true, deep: true })
</script>
