export default defineEventHandler(async (event) => {
  return {
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    method: getMethod(event),
    url: getRequestURL(event).pathname
  }
})