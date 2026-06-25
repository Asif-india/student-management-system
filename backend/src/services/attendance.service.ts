import Attendance from '../models/Attendance.model'
import Student from '../models/Student.model'
import Class from '../models/Class.model'
import { AppError } from '../utils/AppError'

export class AttendanceService {
  /**
   * Mark attendance for multiple students in a class
   */
  static async markAttendance(
    classId: string,
    date: Date,
    attendanceData: Array<{ studentId: string; status: string; remarks?: string }>,
    markedBy?: string
  ) {
    // Verify class exists
    const classExists = await Class.findById(classId)
    if (!classExists) {
      throw new AppError('Class not found', 404)
    }

    const results = []
    const errors = []

    for (const record of attendanceData) {
      try {
        // Verify student exists
        const student = await Student.findById(record.studentId)
        if (!student) {
          errors.push({
            studentId: record.studentId,
            error: 'Student not found'
          })
          continue
        }

        // Check if attendance already exists for this student on this date
        const existingAttendance = await Attendance.findOne({
          studentId: record.studentId,
          classId,
          date: new Date(date)
        })

        let attendance
        if (existingAttendance) {
          // Update existing attendance
          attendance = await Attendance.findByIdAndUpdate(
            existingAttendance._id,
            {
              status: record.status,
              remarks: record.remarks,
              markedBy
            },
            { new: true, runValidators: true }
          ).populate('studentId', 'firstName lastName email')
        } else {
          // Create new attendance
          attendance = await Attendance.create({
            studentId: record.studentId,
            classId,
            date: new Date(date),
            status: record.status,
            remarks: record.remarks,
            markedBy
          })
          await attendance.populate('studentId', 'firstName lastName email')
        }

        results.push(attendance)
      } catch (error: any) {
        // Handle duplicate key error
        if (error.code === 11000) {
          errors.push({
            studentId: record.studentId,
            error: 'Attendance already marked for this student on this date'
          })
        } else {
          errors.push({
            studentId: record.studentId,
            error: error.message || 'Failed to mark attendance'
          })
        }
      }
    }

    return {
      success: true,
      message: `Attendance marked for ${results.length} students`,
      data: results,
      errors: errors.length > 0 ? errors : undefined
    }
  }

  /**
   * Get attendance by ID
   */
  static async getAttendanceById(id: string) {
    const attendance = await Attendance.findById(id)
      .populate('studentId', 'firstName lastName email')
      .populate('classId', 'name code')
      .populate('markedBy', 'name email')

    if (!attendance) {
      throw new AppError('Attendance not found', 404)
    }

    return attendance
  }

  /**
   * Get attendance list with filters and pagination
   */
  static async getAttendanceList(
    page: number = 1,
    limit: number = 10,
    search?: string,
    studentId?: string,
    classId?: string,
    date?: string,
    status?: string,
    startDate?: string,
    endDate?: string,
    sortBy: string = 'date',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ data: any[]; total: number; page: number; totalPages: number }> {
    try {
      const query: any = {}

      if (studentId) query.studentId = studentId
      if (classId) query.classId = classId
      if (date) query.date = new Date(date)
      if (status) query.status = status

      // Date range filter
      if (startDate || endDate) {
        query.date = {}
        if (startDate) query.date.$gte = new Date(startDate)
        if (endDate) query.date.$lte = new Date(endDate)
      }

      // Search filter - find matching studentIds and classIds first
      let matchingStudentIds: string[] = []
      let matchingClassIds: string[] = []

      if (search) {
        // Search students by name/email
        const students = await Student.find({
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ]
        }).select('_id')
        matchingStudentIds = students.map(s => s._id.toString())

        // Search classes by name
        const classes = await Class.find({
          name: { $regex: search, $options: 'i' }
        }).select('_id')
        matchingClassIds = classes.map(c => c._id.toString())

        // Search by status directly
        const statusMatch = { $regex: search, $options: 'i' }

        // Build $or condition for attendance query
        query.$or = [
          { studentId: { $in: matchingStudentIds } },
          { classId: { $in: matchingClassIds } },
          { status: statusMatch },
        ]
      }

      const skip = (page - 1) * limit
      const sortOptions: any = {}
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1

      const [data, total] = await Promise.all([
        Attendance.find(query)
          .populate('studentId', 'firstName lastName email')
          .populate('classId', 'name code')
          .populate('markedBy', 'name email')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit),
        Attendance.countDocuments(query)
      ])

      const totalPages = Math.ceil(total / limit)

      return {
        data,
        total,
        page,
        totalPages,
      }
    } catch (error: any) {
      throw new AppError('Failed to fetch attendance', 500)
    }
  }

  /**
   * Update attendance
   */
  static async updateAttendance(id: string, updateData: {
    status?: string
    remarks?: string
  }) {
    const attendance = await Attendance.findById(id)

    if (!attendance) {
      throw new AppError('Attendance not found', 404)
    }

    Object.assign(attendance, updateData)
    await attendance.save()

    return await Attendance.findById(id)
      .populate('studentId', 'firstName lastName email')
      .populate('classId', 'name code')
      .populate('markedBy', 'name email')
  }

  /**
   * Delete attendance
   */
  static async deleteAttendance(id: string) {
    const attendance = await Attendance.findById(id)

    if (!attendance) {
      throw new AppError('Attendance not found', 404)
    }

    await Attendance.findByIdAndDelete(id)

    return { message: 'Attendance deleted successfully' }
  }

  /**
   * Get attendance statistics for a class
   */
  static async getClassAttendanceStats(classId: string, date?: string) {
    const query: any = { classId }
    if (date) query.date = new Date(date)

    const stats = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const result = {
      present: 0,
      absent: 0,
      late: 0,
      leave: 0,
      total: 0
    }

    stats.forEach(stat => {
      result[stat._id as keyof typeof result] = stat.count
      result.total += stat.count
    })

    return result
  }

  /**
   * Get attendance statistics for a student
   */
  static async getStudentAttendanceStats(studentId: string, startDate?: string, endDate?: string) {
    const query: any = { studentId }

    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    const stats = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const result = {
      present: 0,
      absent: 0,
      late: 0,
      leave: 0,
      total: 0
    }

    stats.forEach(stat => {
      result[stat._id as keyof typeof result] = stat.count
      result.total += stat.count
    })

    // Calculate attendance percentage (present + late) / total
    const attended = result.present + result.late
    const percentage = result.total > 0 ? ((attended / result.total) * 100).toFixed(1) : '0'

    return {
      ...result,
      percentage
    }
  }

  /**
   * Get today's attendance summary
   */
  static async getTodayAttendanceSummary() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const stats = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: today,
            $lt: tomorrow
          }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const result = {
      present: 0,
      absent: 0,
      late: 0,
      leave: 0,
      total: 0
    }

    stats.forEach(stat => {
      result[stat._id as keyof typeof result] = stat.count
      result.total += stat.count
    })

    return result
  }

  /**
   * Get monthly attendance analytics
   */
  static async getMonthlyAttendanceAnalytics(month: number, year: number) {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    const stats = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            status: '$status',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ])

    return stats
  }
}

export default AttendanceService
