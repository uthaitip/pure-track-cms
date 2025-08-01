<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="text-2xl font-bold text-primary-600">
            Nuxt SSR
          </NuxtLink>
          
          <div class="flex space-x-6">
            <NuxtLink 
              to="/" 
              class="text-gray-600 hover:text-primary-600 transition-colors"
              active-class="text-primary-600"
            >
              Home
            </NuxtLink>
            <NuxtLink 
              to="/about" 
              class="text-gray-600 hover:text-primary-600 transition-colors"
              active-class="text-primary-600"
            >
              About
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>
    
    <main>
      <slot />
    </main>
    
    <footer class="bg-white border-t mt-auto">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center text-gray-600">
          <p>&copy; 2024 Nuxt 3 SSR Starter. Built with ❤️ using Nuxt 3, TypeScript & Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
