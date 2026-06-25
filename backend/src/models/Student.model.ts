// Student Mongoose Model
import mongoose, { Document, Schema } from 'mongoose'

export interface IStudent extends Document {
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: Date
  enrollmentDate: Date
  status: 'active' | 'inactive' | 'graduated'
  createdAt: Date
  updatedAt: Date
}

const StudentSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[\d\s-()+]+$/, 'Please provide a valid phone number'],
    },
    dateOfBirth: {
      type: Date,
    },
    enrollmentDate: {
      type: Date,
      required: [true, 'Enrollment date is required'],
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
)

// Index for faster queries
StudentSchema.index({ email: 1 })
StudentSchema.index({ status: 1 })
StudentSchema.index({ createdAt: -1 })

const Student = mongoose.model<IStudent>('Student', StudentSchema)

export default Student
