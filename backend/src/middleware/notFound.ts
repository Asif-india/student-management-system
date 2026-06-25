// 404 Not Found middleware
import { Request, Response, NextFunction } from 'express'

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  })
}
