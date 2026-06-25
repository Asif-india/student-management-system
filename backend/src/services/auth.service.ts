// Authentication service for JWT tokens and password management
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User, UserRole } from '../models'

interface TokenPayload {
  userId: string
  email: string
  role: UserRole
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export class AuthService {
  private static readonly ACCESS_TOKEN_EXPIRY = '15m'
  private static readonly REFRESH_TOKEN_EXPIRY = '7d'

  // Generate access token
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET || 'your-access-secret-key',
      { expiresIn: this.ACCESS_TOKEN_EXPIRY }
    )
  }

  // Generate refresh token
  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      { expiresIn: this.REFRESH_TOKEN_EXPIRY }
    )
  }

  // Generate both tokens
  static generateTokens(payload: TokenPayload): AuthTokens {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    }
  }

  // Verify access token
  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET || 'your-access-secret-key'
      ) as TokenPayload
    } catch (error) {
      throw new Error('Invalid or expired access token')
    }
  }

  // Verify refresh token
  static verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
      ) as TokenPayload
    } catch (error) {
      throw new Error('Invalid or expired refresh token')
    }
  }

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
  }

  // Compare password
  static async comparePassword(
    candidatePassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPassword)
  }

  // Save refresh token to user
  static async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken })
  }

  // Remove refresh token from user (logout)
  static async removeRefreshToken(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: null })
  }

  // Update last login
  static async updateLastLogin(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { lastLogin: new Date() })
  }

  // Find user by email with password
  static async findUserByEmail(email: string): Promise<any> {
    return User.findOne({ email }).select('+password')
  }

  // Find user by ID
  static async findUserById(userId: string): Promise<any> {
    return User.findById(userId)
  }

  // Find user by refresh token
  static async findUserByRefreshToken(refreshToken: string): Promise<any> {
    return User.findOne({ refreshToken }).select('+refreshToken')
  }
}
