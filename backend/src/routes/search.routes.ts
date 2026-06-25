// Search Routes
import { Router } from 'express'
import { globalSearch } from '../controllers/search.controller'
import { authenticate } from '../middleware'

const router = Router()

// Global search endpoint
// GET /api/search?q=query&limit=10&type=student|teacher|class|subject
router.get('/', authenticate, globalSearch)

export default router
