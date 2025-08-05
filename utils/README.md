# API Helper System

A comprehensive, reusable API client system with automatic token management for modern frontend frameworks.

## Files Overview

- **`auth.ts`** - Token management utilities (localStorage)
- **`apiClient.ts`** - Generic API client for any framework
- **`apiClientNuxt.ts`** - Nuxt 3 specific API client with composables
- **`apiExamples.ts`** - Comprehensive usage examples

## Quick Start

### Basic Usage

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from './utils/apiClient'
import { setToken, getToken, removeToken } from './utils/auth'

// Login and store token
const loginResponse = await apiPost('/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
})

setToken(loginResponse.data.token)

// Make authenticated requests
const profile = await apiGet('/api/user/me')
const users = await apiGet('/api/users')
const newUser = await apiPost('/api/user/create', userData)
```

### Nuxt 3 Usage

```typescript
import { nuxtApiGet, useApiCall, useUserManagement } from './utils/apiClientNuxt'

// In a component
const { users, loadingUsers, createUser } = useUserManagement()

// Reactive API call
const { data: profile, pending, error } = useApiCall('/api/user/me')
```

## Features

### Authentication Management
- Automatic token storage in localStorage
- Token expiration checking
- Automatic token removal on logout
- SSR-safe token handling

### API Client Features
- Automatic authentication headers
- Consistent error handling
- Request/response interceptors
- Upload support
- Custom headers support
- TypeScript support with generics

### Error Handling
- Custom `ApiError` class
- HTTP status code handling
- Automatic token removal on 401 errors
- Network error handling

### Nuxt 3 Specific Features
- `$fetch` integration
- Reactive composables
- SSR-friendly lazy loading
- Automatic navigation on auth errors

## API Reference

### Auth Functions

```typescript
setToken(token: string): void
getToken(): string | null
removeToken(): void
isAuthenticated(): boolean
parseToken(token?: string): any | null
isTokenExpired(token?: string): boolean
```

### Generic API Functions

```typescript
apiGet<T>(url: string, options?: RequestInit): Promise<T>
apiPost<T>(url: string, data: any, options?: RequestInit): Promise<T>
apiPut<T>(url: string, data: any, options?: RequestInit): Promise<T>
apiDelete<T>(url: string, options?: RequestInit): Promise<T>
apiUpload<T>(url: string, formData: FormData, options?: RequestInit): Promise<T>
```

### Nuxt 3 API Functions

```typescript
nuxtApiGet<T>(url: string, options?): Promise<T>
nuxtApiPost<T>(url: string, data: any, options?): Promise<T>
nuxtApiPut<T>(url: string, data: any, options?): Promise<T>
nuxtApiDelete<T>(url: string, options?): Promise<T>
```

### Nuxt 3 Composables

```typescript
useApiCall<T>(url: string | (() => string), options?)
useLazyApiCall<T>(url: string | (() => string), options?)
useAuthenticatedApi()
useUserManagement()
```

## Error Handling Examples

```typescript
try {
  const data = await apiGet('/api/some-endpoint')
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        // Handle validation errors
        console.error('Validation error:', error.data?.message)
        break
      case 401:
        // Handle authentication errors
        console.error('Authentication required')
        removeToken()
        // Redirect to login
        break
      case 403:
        // Handle permission errors
        console.error('Insufficient permissions')
        break
      case 404:
        // Handle not found
        console.error('Resource not found')
        break
      case 500:
        // Handle server errors
        console.error('Server error:', error.data?.message)
        break
    }
  }
}
```

## Configuration

### Environment Variables

For non-Nuxt projects, you can set:
```bash
API_BASE_URL=https://api.example.com
```

### Nuxt 3 Runtime Config

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      baseURL: process.env.API_BASE_URL || 'http://localhost:3000'
    }
  }
})
```

## Advanced Usage

### Custom Headers

```typescript
const data = await apiGet('/api/data', {
  headers: {
    'X-Custom-Header': 'value',
    'Accept-Language': 'en-US'
  }
})
```

### File Upload

```typescript
const formData = new FormData()
formData.append('file', file)
formData.append('userId', userId)

const result = await apiUpload('/api/upload/avatar', formData)
```

### Batch Requests

```typescript
const [profile, users, settings] = await Promise.all([
  apiGet('/api/user/me'),
  apiGet('/api/users'),
  apiGet('/api/settings')
])
```

### Retry Logic

```typescript
async function retryApiCall(apiFunction, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiFunction()
    } catch (error) {
      if (attempt === maxRetries || error.status < 500) {
        throw error
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
}
```

## Integration Examples

### Vue 3 Component

```vue
<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <user-card v-for="user in users" :key="user.id" :user="user" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { apiGet } from '@/utils/apiClient'

const users = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    users.value = await apiGet('/api/users')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>
```

### React Component

```tsx
import { useState, useEffect } from 'react'
import { apiGet } from './utils/apiClient'

function UsersList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await apiGet('/api/users')
        setUsers(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUsers()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
```

## License

This API helper system is provided as-is for educational and development purposes.