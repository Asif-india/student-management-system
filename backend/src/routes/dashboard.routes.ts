import { Router } from 'express'
import {
  getDashboardOverview,
  getAttendanceStats,
  getMonthlyAnalytics,
  getRecentActivities,
} from '../controllers/dashboard.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

// All dashboard routes require authentication
router.use(authenticate)

// Get dashboard overview
router.get('/overview', getDashboardOverview)

// Get attendance statistics
router.get('/attendance-stats', getAttendanceStats)

// Get monthly analytics
router.get('/monthly-analytics', getMonthlyAnalytics)

// Get recent activities
router.get('/recent-activities', getRecentActivities)

export default router
