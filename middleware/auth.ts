export default defineNuxtRouteMiddleware(async () => {
  const { isLoggedIn, fetchUser, token, user } = useAuth()

  // If we have a token but no user data (after refresh), try to fetch user first
  if (import.meta.client && token.value && !user.value) {
    try {
      await fetchUser()
    } catch (error) {
      // If fetchUser fails, the token is invalid, so redirect to login
      return navigateTo('/login')
    }
  }

  // If not logged in, redirect to login
  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }
})