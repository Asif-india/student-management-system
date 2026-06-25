// Student routes
import { Router } from 'express'
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentStats,
} from '../controllers'

const router = Router()

// Create a new student
router.post('/', createStudent)

// Get all students with pagination, search, filter, and sort
router.get('/', getAllStudents)

// Get student statistics
router.get('/stats', getStudentStats)

// Get a specific student by ID
router.get('/:id', getStudentById)

// Update a student
router.put('/:id', updateStudent)

// Delete a student
router.delete('/:id', deleteStudent)

export default router
