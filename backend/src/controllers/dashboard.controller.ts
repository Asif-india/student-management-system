import { Request, Response, NextFunction } from 'express'
import DashboardService from '../services/dashboard.service'

export const getDashboardOverview = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const overview = await DashboardService.getDashboardOverview()

    res.status(200).json({
      success: true,
      data: overview.data,
    })
  } catch (error) {
    next(error)
  }
}

export const getAttendanceStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await DashboardService.getAttendanceStats()

    res.status(200).json({
      success: true,
      data: stats,
    })
  } catch (error) {
    next(error)
  }
}

export const getMonthlyAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { year } = req.query
    const analytics = await DashboardService.getMonthlyAnalytics(
      year ? parseInt(year as string) : undefined
    )

    res.status(200).json({
      success: true,
      data: analytics,
    })
  } catch (error) {
    next(error)
  }
}

export const getRecentActivities = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const activities = await DashboardService.getRecentActivities()

    res.status(200).json({
      success: true,
      data: activities,
    })
  } catch (error) {
    next(error)
  }
}
