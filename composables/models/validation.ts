// Validation schemas - using simple validation functions instead of yup
export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Please enter a valid email'
  return null
}

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required'
  if (password.length < 6) return 'Password must be at least 6 characters'
  return null
}

export const validateName = (name: string, fieldName: string): string | null => {
  if (!name) return `${fieldName} is required`
  if (name.length < 2) return `${fieldName} must be at least 2 characters`
  return null
}

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value) return `${fieldName} is required`
  return null
}

export const validateNumber = (value: number, fieldName: string, min = 0): string | null => {
  if (value === undefined || value === null) return `${fieldName} is required`
  if (value < min) return `${fieldName} cannot be less than ${min}`
  return null
}

export const validateUrl = (url: string): string | null => {
  if (!url) return null // URL is optional
  try {
    new URL(url)
    return null
  } catch {
    return 'Please enter a valid URL'
  }
}

// Legacy yup-style schemas for backward compatibility
export const loginSchema = {
  validate: (data: { email: string; password: string }) => {
    const errors: Record<string, string> = {}
    const emailError = validateEmail(data.email)
    const passwordError = validatePassword(data.password)
    
    if (emailError) errors.email = emailError
    if (passwordError) errors.password = passwordError
    
    return Object.keys(errors).length > 0 ? { errors } : { errors: null }
  }
}