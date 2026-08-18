// MongoDB connection setup
import mongoose from 'mongoose'

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI

    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set')
    }
    
    await mongoose.connect(mongoUri, {
      // Mongoose 8.x doesn't require these options anymore, but keeping for compatibility
    })

    console.log('Connected Database:', mongoose.connection.name)
    console.log('Connected Host:', mongoose.connection.host)
    console.log('Connected ReadyState:', mongoose.connection.readyState)
    console.log('MongoDB connected successfully')
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected')
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('MongoDB connection closed through app termination')
      process.exit(0)
    })
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1)
  }
}

export default connectDB
