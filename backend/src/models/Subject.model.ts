// Subject Mongoose Model
import mongoose, { Document, Schema } from 'mongoose'

export interface ISubject extends Document {
  name: string
  code: string
  description?: string
  credits: number
  type: 'core' | 'elective' | 'optional'
  grade: string
  assignedTeachers?: string[]
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

const SubjectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    credits: {
      type: Number,
      required: [true, 'Credits are required'],
      min: [1, 'Credits must be at least 1'],
      max: [10, 'Credits cannot exceed 10'],
    },
    type: {
      type: String,
      enum: ['core', 'elective', 'optional'],
      default: 'core',
    },
    grade: {
      type: String,
      required: [true, 'Grade is required'],
      trim: true,
    },
    assignedTeachers: [{
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
    }],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for faster queries
SubjectSchema.index({ code: 1 })
SubjectSchema.index({ grade: 1 })
SubjectSchema.index({ type: 1 })
SubjectSchema.index({ status: 1 })
SubjectSchema.index({ createdAt: -1 })

const Subject = mongoose.model<ISubject>('Subject', SubjectSchema)

export default Subject
