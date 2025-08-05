<template>
  <div class="drawer lg:drawer-open">
    <input id="drawer-toggle" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <!-- Navbar -->
      <div class="navbar bg-base-100 w-full lg:hidden">
        <div class="flex-none">
          <label for="drawer-toggle" class="btn btn-square btn-ghost">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
        </div>
        <div class="flex-1">
          <h1 class="text-xl font-semibold">CMS System</h1>
        </div>
      </div>
      
      <!-- Main content -->
      <main class="flex-1 p-4 lg:p-6 bg-base-200 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
    
    <!-- Sidebar -->
    <div class="drawer-side">
      <label for="drawer-toggle" class="drawer-overlay"></label>
      <UILayoutAppSidebar v-if="mounted" />
      <div v-else class="w-64 min-h-full bg-base-200">
        <div class="p-4">
          <div class="skeleton h-6 w-32 mb-2"></div>
          <div class="skeleton h-4 w-24 mb-4"></div>
          <div class="space-y-2">
            <div class="skeleton h-8 w-full"></div>
            <div class="skeleton h-8 w-full"></div>
            <div class="skeleton h-8 w-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref , onMounted } from 'vue';
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
});

</script>