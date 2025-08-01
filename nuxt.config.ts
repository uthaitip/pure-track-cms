export default defineNuxtConfig({
  // Enable SSR (Server-Side Rendering) - this is the default
  ssr: true,

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false
  },

  // CSS framework
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  // Development tools
  devtools: { enabled: true },

  // Vite configuration
  vite: {
    server: {
      hmr: {
        port: 3001
      }
    },
    optimizeDeps: {
      exclude: ['@vite/client', '@vite/env']
    },
    build: {
      rollupOptions: {
        external: ['@vite/client', '@vite/env']
      }
    }
  },

  // Performance optimizations
  experimental: {
    payloadExtraction: false, // Improves performance for SSR
    renderJsonPayloads: true
  },

  // Route rules for caching and performance
  routeRules: {
    // Homepage pre-rendered at build time
    '/': { prerender: true },
    // About page pre-rendered at build time  
    '/about': { prerender: true },
    // Admin dashboard renders only on client-side
    '/admin/**': { ssr: false },
    // Add headers to all routes
    '/**': { 
      headers: { 
        'Cache-Control': 's-maxage=60',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff'
      } 
    }
  },

  // Nitro configuration for server-side caching
  nitro: {
    compatibilityDate: '2025-08-01',
    storage: {
      cache: {
        driver: 'memory',
        max: 1000
      }
    },
    // Enable compression
    compressPublicAssets: true,
    // Minify server code
    minify: true
  },

  // Build optimizations
  build: {
    // Transpile specific packages if needed
    transpile: []
  },

  // Runtime config for environment variables
  runtimeConfig: {
    // Private keys (only available on server-side)
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    nuxtSecretKey: process.env.NUXT_SECRET_KEY,
    // Public keys (exposed to client-side)
    public: {
      apiBase: '/api'
    }
  },

  // App configuration
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'CMS System - Role-based Management',
      meta: [
        { name: 'description', content: 'A modern role-based content management system built with Nuxt 3' }
      ]
    }
  }
})