export default defineNuxtRouteMiddleware(() => {
  const { isLoggedIn } = useAuth()

  // If already logged in, redirect to dashboard
  if (isLoggedIn.value) {
    return navigateTo('/dashboard')
  }
})