// Subject routes
import { Router } from 'express'
import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  assignSubjectTeachers,
  getSubjectStats,
} from '../controllers'

const router = Router()

// Subject CRUD routes
router.post('/', createSubject)
router.get('/', getAllSubjects)
router.get('/stats', getSubjectStats)
router.get('/:id', getSubjectById)
router.put('/:id', updateSubject)
router.delete('/:id', deleteSubject)

// Subject assignment routes
router.post('/:id/teachers', assignSubjectTeachers)

export default router
