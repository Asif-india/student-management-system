// Main application entry point
import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Import configurations
import { helmetConfig, corsConfig, rateLimiter, apiRateLimiter } from './config/security'
import { config } from './config'

// Import database connection
import { connectDB } from './database'

// Import middleware
import { errorHandler, notFound } from './middleware'

// Import routes
import { authRoutes, studentRoutes, teacherRoutes, classRoutes, subjectRoutes, searchRoutes, attendanceRoutes, dashboardRoutes } from './routes'

const app = express()
const PORT = config.port

// Security middleware
app.use(helmetConfig)

// CORS configuration
app.use(corsConfig)

// Rate limiting
app.use(rateLimiter)

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging middleware
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'))
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/students', apiRateLimiter, studentRoutes)
app.use('/api/teachers', apiRateLimiter, teacherRoutes)
app.use('/api/classes', apiRateLimiter, classRoutes)
app.use('/api/subjects', apiRateLimiter, subjectRoutes)
app.use('/api/search', apiRateLimiter, searchRoutes)
app.use('/api/attendance', apiRateLimiter, attendanceRoutes)
app.use('/api/dashboard', apiRateLimiter, dashboardRoutes)

// Root API endpoint
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student Management System API is running',
    version: '1.0.0',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  })
})

// 404 handler
app.use(notFound)

// Error handling middleware
app.use(errorHandler)

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB()

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
      console.log(`Environment: ${config.nodeEnv}`)
      console.log(`Frontend URL: ${config.frontendUrl}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app
