export default defineNuxtPlugin(async () => {
  const { fetchUser, token } = useAuth()
  
  // If we have a token on app startup, try to fetch user data
  if (token.value) {
    try {
      await fetchUser()
    } catch (error) {
      console.log('Auth initialization failed, token may be expired')
    }
  }
})