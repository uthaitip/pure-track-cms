import mongoose from 'mongoose'

let isConnected = false

export const connectDB = async () => {
  if (isConnected) {
    return
  }

  try {
    const config = useRuntimeConfig()
    const mongoUri = config.mongoUri || process.env.MONGO_URI
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables')
    }

    // Vercel has connection limits, so we need to handle this carefully
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    }

    await mongoose.connect(mongoUri, options)
    isConnected = true
    console.log('✅ MongoDB connected successfully')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
}

export const disconnectDB = async () => {
  if (!isConnected) {
    return
  }

  try {
    await mongoose.disconnect()
    isConnected = false
    console.log('✅ MongoDB disconnected successfully')
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error)
    throw error
  }
}