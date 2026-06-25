// Class routes
import { Router } from 'express'
import {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  assignClassTeacher,
  assignClassStudents,
  assignClassSubjects,
  getClassStats,
} from '../controllers'

const router = Router()

// Class CRUD routes
router.post('/', createClass)
router.get('/', getAllClasses)
router.get('/stats', getClassStats)
router.get('/:id', getClassById)
router.put('/:id', updateClass)
router.delete('/:id', deleteClass)

// Class assignment routes
router.post('/:id/teacher', assignClassTeacher)
router.post('/:id/students', assignClassStudents)
router.post('/:id/subjects', assignClassSubjects)

export default router
