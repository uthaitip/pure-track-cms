<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content flex-col lg:flex-row-reverse">
      <div class="text-center lg:text-left">
        <h1 class="text-5xl font-bold">Welcome Back!</h1>
        <p class="py-6">Sign in to access your CMS dashboard and manage your content with ease.</p>
      </div>
      
      <div class="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form class="card-body" @submit.prevent="handleLogin">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="email@example.com"
              class="input input-bordered"
              required
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Enter your password"
              class="input input-bordered"
              required
            />
          </div>

          <div v-if="error" class="alert alert-error">
            <i class="fas fa-exclamation-circle"></i>
            <span>{{ error }}</span>
          </div>

          <div class="form-control mt-6">
            <button
              type="submit"
              :disabled="loading"
              class="btn btn-primary w-full"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>

          <div class="divider">OR</div>
          
          <div class="text-center">
            <NuxtLink to="/register" class="link link-primary">
              Don't have an account? Sign up
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'guest'
})

const { login } = useAuth()

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  const result = await login(form)
  
  if (!result.success) {
    error.value = result.error || 'Login failed'
  }
  
  loading.value = false
}

useSeoMeta({
  title: 'Login - CMS System',
  description: 'Sign in to your CMS account'
})
</script>