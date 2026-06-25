// Configuration management
// This file will contain all configuration settings

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/student-management',
  },
}
