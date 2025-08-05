/**
 * Shared API types and error classes
 */

/**
 * API Error class for better error handling
 */
export class ApiError extends Error {
  public status: number
  public statusText: string
  public data?: any

  constructor(status: number, statusText: string, data?: any) {
    super(`API Error: ${status} ${statusText}`)
    this.status = status
    this.statusText = statusText
    this.data = data
    this.name = 'ApiError'
  }
}