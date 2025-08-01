export default defineNuxtPlugin(() => {
  // This plugin only runs on the client side
  if (process.client) {
    console.log('Analytics plugin loaded on client')
    
    // Initialize your analytics here
    // Example: Google Analytics, Mixpanel, etc.
  }
})