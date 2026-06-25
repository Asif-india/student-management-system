// Authentication middleware for JWT verification and role-based access
import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services'
import { AppError } from './errorHandler'
import { UserRole } from '../models'

// Extend Express Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        email: string
        role: UserRole
      }
    }
  }
}

// Authenticate middleware - verifies JWT access token
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token is required', 401)
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const payload = AuthService.verifyAccessToken(token)

    // Attach user info to request
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    }

    next()
  } catch (error) {
    next(new AppError('Invalid or expired access token', 401))
  }
}

// Role-based access control middleware
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required', 401)
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        403
      )
    }

    next()
  }
}

// Admin only middleware
export const adminOnly = authorize(UserRole.ADMIN)

// Teacher and Admin middleware
export const teacherOrAdmin = authorize(UserRole.TEACHER, UserRole.ADMIN)

// Student, Teacher, and Admin middleware (all authenticated users)
export const authenticatedOnly = authorize(
  UserRole.STUDENT,
  UserRole.TEACHER,
  UserRole.ADMIN
)
