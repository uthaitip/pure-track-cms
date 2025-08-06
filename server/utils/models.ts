// Central model registry to ensure all models are properly registered
import { Permission } from '../models/Permission'
import { Role } from '../models/Role'
import { User } from '../models/User'
import { Menu } from '../models/Menu'

// Export all models to ensure they're registered when this file is imported
export {
  Permission,
  Role,
  User,
  Menu
}

// Utility function to ensure all models are loaded
export const ensureModelsLoaded = () => {
  // Just importing this file will register all models
  return true
}