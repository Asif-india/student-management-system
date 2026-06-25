import dotenv from 'dotenv'
import mongoose from 'mongoose'

import { connectDB } from '../database'
import { User, UserRole } from '../models'

dotenv.config()

const createAdmin = async (): Promise<void> => {
  try {
    // Connect Database
    await connectDB()

    // Check existing admin
    const existingAdmin = await User.findOne({
      role: UserRole.ADMIN,
    })

    if (existingAdmin) {
      console.log('⚠️ Admin already exists')
      process.exit(0)
    }

    // Create admin user
    const admin = new User({
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin@sms.com',
      password: 'Admin@123',
      role: UserRole.ADMIN,
      isActive: true,
    })

    await admin.save()

    console.log('✅ Admin created successfully')
    console.log('Email: admin@sms.com')
    console.log('Password: Admin@123')

    process.exit(0)

  } catch (error) {
    console.error('❌ Failed to create admin:', error)
    process.exit(1)

  } finally {
    await mongoose.connection.close()
  }
}

createAdmin()