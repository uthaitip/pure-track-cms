export default defineEventHandler(async (event) => {
  try {
    // In a stateless JWT system, logout is typically handled client-side
    // by removing the token from storage. However, we can still provide
    // a logout endpoint for consistency and potential future token blacklisting.
    
    return {
      success: true,
      message: 'Logged out successfully'
    }

  } catch (error: any) {
    console.error('Logout error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})