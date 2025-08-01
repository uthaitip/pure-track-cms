<template>
  <NuxtLayout>
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
        
        <div class="prose prose-lg max-w-none">
          <p class="text-xl text-gray-600 mb-8">
            Welcome to our Nuxt 3 SSR starter project. This page demonstrates server-side rendering
            with static content that's optimized for performance and SEO.
          </p>
          
          <div class="grid md:grid-cols-2 gap-8 mb-8">
            <div class="bg-white p-6 rounded-lg shadow-sm border">
              <h2 class="text-2xl font-semibold mb-4">Our Mission</h2>
              <p class="text-gray-600">
                To provide developers with modern, performant web applications using the latest
                technologies and best practices in server-side rendering.
              </p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-sm border">
              <h2 class="text-2xl font-semibold mb-4">Technologies</h2>
              <ul class="text-gray-600 space-y-2">
                <li>• Nuxt 3 with SSR</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Vue 3 Composition API</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-primary-50 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-3">Performance Features</h3>
            <p class="text-gray-700">
              This page is pre-rendered at build time for optimal performance and cached
              with appropriate headers for fast subsequent loads.
            </p>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
// Meta tags for SEO (server-side rendered)
useSeoMeta({
  title: 'About Us - Nuxt 3 SSR Starter',
  ogTitle: 'About Us - Nuxt 3 SSR Starter',
  description: 'Learn about our Nuxt 3 SSR starter project with TypeScript and Tailwind CSS.',
  ogDescription: 'Learn about our Nuxt 3 SSR starter project with TypeScript and Tailwind CSS.',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image'
})

// This runs on the server during SSR
console.log('About page rendered on server')
</script>