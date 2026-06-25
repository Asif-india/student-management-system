// Class Mongoose Model
import mongoose, { Document, Schema } from 'mongoose'

export interface IClass extends Document {
  name: string
  code: string
  grade: string
  section: string
  academicYear: string
  classTeacher?: string
  students?: string[]
  subjects?: string[]
  capacity: number
  status: 'active' | 'inactive' | 'archived'
  createdAt: Date
  updatedAt: Date
}

const ClassSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Class code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    grade: {
      type: String,
      required: [true, 'Grade is required'],
      trim: true,
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      trim: true,
      uppercase: true,
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
    },
    classTeacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    students: [{
      type: Schema.Types.ObjectId,
      ref: 'Student',
    }],
    subjects: [{
      type: Schema.Types.ObjectId,
      ref: 'Subject',
    }],
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for faster queries
ClassSchema.index({ code: 1 })
ClassSchema.index({ grade: 1, section: 1 })
ClassSchema.index({ academicYear: 1 })
ClassSchema.index({ status: 1 })
ClassSchema.index({ classTeacher: 1 })
ClassSchema.index({ createdAt: -1 })

const Class = mongoose.model<IClass>('Class', ClassSchema)

export default Class
