import { Request, Response, NextFunction } from 'express'
import AttendanceService from '../services/attendance.service'

export const markAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classId, date, attendance } = req.body
    const markedBy = req.user?.userId

    const result = await AttendanceService.markAttendance(
      classId,
      date,
      attendance,
      markedBy
    )

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.data,
      errors: result.errors
    })
  } catch (error) {
    next(error)
  }
}

export const getAttendanceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const attendance = await AttendanceService.getAttendanceById(id)

    res.status(200).json({
      success: true,
      data: attendance
    })
  } catch (error) {
    next(error)
  }
}

export const getAttendanceList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, sortBy, sortOrder } = req.query
    const search = req.query.search as string | undefined
    const studentId = req.query.studentId as string | undefined
    const classId = req.query.classId as string | undefined
    const date = req.query.date as string | undefined
    const status = req.query.status as string | undefined
    const startDate = req.query.startDate as string | undefined
    const endDate = req.query.endDate as string | undefined

    const result = await AttendanceService.getAttendanceList(
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 10,
      search,
      studentId,
      classId,
      date,
      status,
      startDate,
      endDate,
      sortBy as string || 'date',
      sortOrder as 'asc' | 'desc' || 'desc'
    )

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: {
        page: result.page,
        limit: parseInt(limit as string) || 10,
        total: result.total,
        totalPages: result.totalPages
      }
    })
  } catch (error) {
    next(error)
  }
}

export const updateAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { status, remarks } = req.body

    const attendance = await AttendanceService.updateAttendance(id, {
      status,
      remarks
    })

    res.status(200).json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance
    })
  } catch (error) {
    next(error)
  }
}

export const deleteAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await AttendanceService.deleteAttendance(id)

    res.status(200).json({
      success: true,
      message: result.message
    })
  } catch (error) {
    next(error)
  }
}

export const getClassAttendanceStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classId } = req.params
    const { date } = req.query

    const stats = await AttendanceService.getClassAttendanceStats(
      classId as string,
      date as string
    )

    res.status(200).json({
      success: true,
      data: stats
    })
  } catch (error) {
    next(error)
  }
}

export const getStudentAttendanceStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params
    const { startDate, endDate } = req.query

    const stats = await AttendanceService.getStudentAttendanceStats(
      studentId as string,
      startDate as string,
      endDate as string
    )

    res.status(200).json({
      success: true,
      data: stats
    })
  } catch (error) {
    next(error)
  }
}

export const getTodayAttendanceSummary = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await AttendanceService.getTodayAttendanceSummary()

    res.status(200).json({
      success: true,
      data: summary
    })
  } catch (error) {
    next(error)
  }
}

export const getMonthlyAttendanceAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { month, year } = req.query

    const analytics = await AttendanceService.getMonthlyAttendanceAnalytics(
      parseInt(month as string),
      parseInt(year as string)
    )

    res.status(200).json({
      success: true,
      data: analytics
    })
  } catch (error) {
    next(error)
  }
}
