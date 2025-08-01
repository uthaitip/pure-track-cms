<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">CMS System</h1>
        <p class="text-lg text-gray-600 mb-8">
          Role-based Content Management System with SSR
        </p>
      </div>
      
      <div class="space-y-4">
        <NuxtLink
          to="/login"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign In
        </NuxtLink>
        
        <NuxtLink
          to="/register"
          class="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Account
        </NuxtLink>
      </div>

      <div class="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 class="text-sm font-medium text-blue-800 mb-2">Demo Accounts</h3>
        <div class="text-xs text-blue-700 space-y-1">
          <p><strong>Admin:</strong> admin@example.com / admin123</p>
          <p><strong>HR:</strong> hr@example.com / password123</p>
          <p><strong>Accountant:</strong> accountant@example.com / password123</p>
          <p><strong>Employee:</strong> employee@example.com / password123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'guest'
})

useSeoMeta({
  title: 'CMS System - Role-based Management',
  description: 'A modern role-based content management system built with Nuxt 3'
})
</script>