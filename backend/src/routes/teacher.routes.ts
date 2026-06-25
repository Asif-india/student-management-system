// Teacher routes
import { Router } from 'express'
import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  assignClasses,
  assignSubjects,
  getTeacherStats,
} from '../controllers'

const router = Router()

// Create a new teacher
router.post('/', createTeacher)

// Get all teachers with pagination, search, filter, and sort
router.get('/', getAllTeachers)

// Get teacher statistics
router.get('/stats', getTeacherStats)

// Get a specific teacher by ID
router.get('/:id', getTeacherById)

// Update a teacher
router.put('/:id', updateTeacher)

// Delete a teacher
router.delete('/:id', deleteTeacher)

// Assign classes to a teacher
router.post('/:id/classes', assignClasses)

// Assign subjects to a teacher
router.post('/:id/subjects', assignSubjects)

export default router
