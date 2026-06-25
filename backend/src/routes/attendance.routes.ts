import { Router } from 'express'
import {
  markAttendance,
  getAttendanceById,
  getAttendanceList,
  updateAttendance,
  deleteAttendance,
  getClassAttendanceStats,
  getStudentAttendanceStats,
  getTodayAttendanceSummary,
  getMonthlyAttendanceAnalytics
} from '../controllers/attendance.controller'
import {
  markAttendanceSchema,
  updateAttendanceSchema,
  getAttendanceSchema,
  getAttendanceListSchema,
  deleteAttendanceSchema,
  validate
} from '../validators/attendance.validator'
import { authenticate } from '../middleware/auth'

const router = Router()

// All attendance routes require authentication
router.use(authenticate)

// Mark attendance for multiple students in a class
router.post(
  '/mark',
  validate(markAttendanceSchema, 'body'),
  markAttendance
)

// Get attendance list with filters and pagination
router.get(
  '/',
  validate(getAttendanceListSchema, 'query'),
  getAttendanceList
)

// Get today's attendance summary
router.get(
  '/summary/today',
  getTodayAttendanceSummary
)

// Get monthly attendance analytics
router.get(
  '/analytics/monthly',
  getMonthlyAttendanceAnalytics
)

// Get attendance statistics for a class
router.get(
  '/stats/class/:classId',
  getClassAttendanceStats
)

// Get attendance statistics for a student
router.get(
  '/stats/student/:studentId',
  getStudentAttendanceStats
)

// Get attendance by ID
router.get(
  '/:id',
  validate(getAttendanceSchema, 'params'),
  getAttendanceById
)

// Update attendance
router.put(
  '/:id',
  validate(updateAttendanceSchema, 'body'),
  updateAttendance
)

// Delete attendance
router.delete(
  '/:id',
  validate(deleteAttendanceSchema, 'params'),
  deleteAttendance
)

export default router
