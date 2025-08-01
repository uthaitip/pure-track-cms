export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn, fetchUser } = useAuth()

  // If not logged in, redirect to login
  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }

  // Fetch user data if not already loaded
  if (process.client && isLoggedIn.value) {
    fetchUser()
  }
})