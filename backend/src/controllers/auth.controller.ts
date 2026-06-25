// Authentication controllers
import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services'
import { AppError } from '../middleware'
import { sendSuccess } from '../utils/apiResponse'

// Login controller
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await AuthService.findUserByEmail(email)

    if (!user) {
      throw new AppError('Invalid email or password', 401)
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Your account has been deactivated', 403)
    }

    // Compare password
    const isPasswordValid = await AuthService.comparePassword(password, user.password)

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401)
    }

    // Generate tokens
    const tokens = AuthService.generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Save refresh token
    await AuthService.saveRefreshToken(user._id.toString(), tokens.refreshToken)

    // Update last login
    await AuthService.updateLastLogin(user._id.toString())

    // Send response
    sendSuccess(res, {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }, 'Login successful')
  } catch (error) {
    next(error)
  }
}

// Logout controller
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user.userId

    // Remove refresh token
    await AuthService.removeRefreshToken(userId)

    sendSuccess(res, null, 'Logout successful')
  } catch (error) {
    next(error)
  }
}

// Refresh token controller
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400)
    }

    // Verify refresh token
    void AuthService.verifyRefreshToken(refreshToken)

    // Find user by refresh token
    const user = await AuthService.findUserByRefreshToken(refreshToken)

    if (!user) {
      throw new AppError('Invalid refresh token', 401)
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Your account has been deactivated', 403)
    }

    // Generate new tokens
    const tokens = AuthService.generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Save new refresh token
    await AuthService.saveRefreshToken(user._id.toString(), tokens.refreshToken)

    // Send response
    sendSuccess(res, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }, 'Token refreshed successfully')
  } catch (error) {
    next(error)
  }
}

// Get current user controller
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user.userId

    const user = await AuthService.findUserById(userId)

    if (!user) {
      throw new AppError('User not found', 404)
    }

    sendSuccess(res, {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    })
  } catch (error) {
    next(error)
  }
}
