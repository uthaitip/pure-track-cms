export default defineNuxtRouteMiddleware((to) => {
  const { user, hasRole } = useAuth()

  // Get required roles from route meta
  const requiredRoles = to.meta.roles as string[] | string | undefined

  if (!requiredRoles) {
    return // No role restrictions
  }

  if (!user.value) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  // Check if user has required role
  if (!hasRole(requiredRoles)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied: Insufficient permissions'
    })
  }
})