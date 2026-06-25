// Authentication routes
import { Router } from 'express'
import { login, logout, refreshToken, getCurrentUser } from '../controllers'
import { validate } from '../middleware'
import { authRateLimiter } from '../config/security'
import { authenticate } from '../middleware'
import { loginSchema, refreshTokenSchema } from '../validators'

const router = Router()

// Public routes
router.post('/login', authRateLimiter, validate(loginSchema), login)
router.post('/refresh-token', validate(refreshTokenSchema), refreshToken)

// Protected routes
router.post('/logout', authenticate, logout)
router.get('/me', authenticate, getCurrentUser)

export default router
