import Student from '../models/Student.model'
import Teacher from '../models/Teacher.model'
import Class from '../models/Class.model'
import Subject from '../models/Subject.model'
import Attendance from '../models/Attendance.model'

export class DashboardService {
  /**
   * Get dashboard overview statistics
   */
  static async getDashboardOverview() {
    try {
      // Use Promise.all for parallel database queries
      const [
        totalStudents,
        totalTeachers,
        totalClasses,
        totalSubjects,
        attendanceStats,
      ] = await Promise.all([
        Student.countDocuments(),
        Teacher.countDocuments(),
        Class.countDocuments(),
        Subject.countDocuments(),
        this.getAttendanceStats(),
      ])

      return {
        success: true,
        data: {
          totalStudents,
          totalTeachers,
          totalClasses,
          totalSubjects,
          attendance: attendanceStats,
        },
      }
    } catch (error: any) {
      throw new Error(`Failed to fetch dashboard overview: ${error.message}`)
    }
  }

  /**
   * Get attendance statistics using MongoDB aggregation
   */
  static async getAttendanceStats() {
    const attendanceAggregation = await Attendance.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ])

    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      leave: 0,
      total: 0,
    }

    attendanceAggregation.forEach((item) => {
      if (item._id === 'present') stats.present = item.count
      if (item._id === 'absent') stats.absent = item.count
      if (item._id === 'late') stats.late = item.count
      if (item._id === 'leave') stats.leave = item.count
    })

    stats.total = stats.present + stats.absent + stats.late + stats.leave

    // Calculate attendance rate
    const attendanceRate = stats.total > 0
      ? ((stats.present + stats.late) / stats.total) * 100
      : 0

    return {
      ...stats,
      attendanceRate: attendanceRate.toFixed(1),
    }
  }

  /**
   * Get monthly analytics for the current year
   */
  static async getMonthlyAnalytics(year?: number) {
    const currentYear = year || new Date().getFullYear()
    const startDate = new Date(currentYear, 0, 1)
    const endDate = new Date(currentYear, 11, 31, 23, 59, 59)

    const monthlyAnalytics = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.month',
          data: {
            $push: {
              status: '$_id.status',
              count: '$count',
            },
          },
          total: { $sum: '$count' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Format the data for frontend
    const formattedData = Array.from({ length: 12 }, (_, index) => {
      const monthData = monthlyAnalytics.find((item) => item._id === index + 1)
      const statusCounts = {
        present: 0,
        absent: 0,
        late: 0,
        leave: 0,
      }

      if (monthData?.data) {
        monthData.data.forEach((item: any) => {
          statusCounts[item.status as keyof typeof statusCounts] = item.count
        })
      }

      return {
        month: index + 1,
        monthName: new Date(currentYear, index).toLocaleString('default', { month: 'short' }),
        ...statusCounts,
        total: monthData?.total || 0,
      }
    })

    return formattedData
  }

  /**
   * Get recent activities for dashboard
   */
  static async getRecentActivities() {
    const recentStudents = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName createdAt')

    const recentTeachers = await Teacher.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName department createdAt')

    const recentClasses = await Class.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name grade section createdAt')

    const recentSubjects = await Subject.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name type createdAt')

    const recentAttendance = await Attendance.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('studentId', 'firstName lastName')
      .select('studentId status createdAt')

    return {
      students: recentStudents,
      teachers: recentTeachers,
      classes: recentClasses,
      subjects: recentSubjects,
      attendance: recentAttendance,
    }
  }
}

export default DashboardService
