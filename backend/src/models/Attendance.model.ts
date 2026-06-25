import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAttendance extends Document {
  studentId: mongoose.Types.ObjectId
  classId: mongoose.Types.ObjectId
  date: Date
  status: 'present' | 'absent' | 'late' | 'leave'
  remarks?: string
  markedBy?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const AttendanceSchema: Schema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
      index: true
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class ID is required'],
      index: true
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'leave'],
      required: [true, 'Status is required'],
      default: 'present'
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [500, 'Remarks cannot exceed 500 characters']
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

// Compound index for unique attendance record per student per date per class
AttendanceSchema.index({ studentId: 1, classId: 1, date: 1 }, { unique: true })

const Attendance: Model<IAttendance> = mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema)

export default Attendance
