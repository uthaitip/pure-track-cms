import mongoose from 'mongoose'

// Import all model files to ensure schemas are registered
import '../models/Permission'
import '../models/Role'
import '../models/User'  
import '../models/Menu'

// Utility function to ensure all models are loaded
export const ensureModelsLoaded = () => {
  console.log('Models loaded, registered models:', Object.keys(mongoose.models))
  return true
}

// Re-export models for convenience
export { Permission } from '../models/Permission'
export { Role } from '../models/Role'
export { User } from '../models/User'
export { Menu } from '../models/Menu'