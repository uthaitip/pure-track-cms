import mongoose from 'mongoose'

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return

  try {
    await mongoose.connect(process.env.MONGO_URI!)
    console.log('MongoDB connected')
  } catch (err) {
    console.error(err)
    throw createError({ statusCode: 500, statusMessage: 'Database connection failed' })
  }
}
