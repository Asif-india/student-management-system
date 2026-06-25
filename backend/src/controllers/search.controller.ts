// Global Search Controller
import { Request, Response, NextFunction } from 'express'
import Student from '../models/Student.model'
import Teacher from '../models/Teacher.model'
import Class from '../models/Class.model'
import Subject from '../models/Subject.model'
import { sendSuccess, sendError } from '../utils/apiResponse'

export interface SearchResult {
  type: 'student' | 'teacher' | 'class' | 'subject'
  id: string
  title: string
  subtitle: string
  metadata: Record<string, any>
  url: string
}

// Escape regex special characters to prevent errors
const escapeRegex = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const ALLOWED_TYPES = ['student', 'teacher', 'class', 'subject']

export const globalSearch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query.q as string
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50) // Cap at 50
    const type = req.query.type as string

    if (!query || query.trim().length < 2) {
      void sendError(res, 'Search query must be at least 2 characters', 400)
      return
    }

    // Validate type parameter if provided
    if (type && !ALLOWED_TYPES.includes(type)) {
      void sendError(res, `Invalid type. Must be one of: ${ALLOWED_TYPES.join(', ')}`, 400)
      return
    }

    const searchTerm = escapeRegex(query.trim())
    const results: SearchResult[] = []

    // Execute all searches in parallel for better performance
    const [students, teachers, classes, subjects] = await Promise.all([
      // Search Students
      (!type || type === 'student') ? Student.find({
        $or: [
          { firstName: { $regex: searchTerm, $options: 'i' } },
          { lastName: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
        ],
        status: 'active',
      })
        .select('firstName lastName email status')
        .limit(limit) : Promise.resolve([]),

      // Search Teachers
      (!type || type === 'teacher') ? Teacher.find({
        $or: [
          { firstName: { $regex: searchTerm, $options: 'i' } },
          { lastName: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { employeeId: { $regex: searchTerm, $options: 'i' } },
          { department: { $regex: searchTerm, $options: 'i' } },
        ],
        status: { $ne: 'inactive' },
      })
        .select('firstName lastName email employeeId department status')
        .limit(limit) : Promise.resolve([]),

      // Search Classes
      (!type || type === 'class') ? Class.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { code: { $regex: searchTerm, $options: 'i' } },
          { grade: { $regex: searchTerm, $options: 'i' } },
          { section: { $regex: searchTerm, $options: 'i' } },
        ],
        status: 'active',
      })
        .select('name code grade section capacity status')
        .limit(limit) : Promise.resolve([]),

      // Search Subjects
      (!type || type === 'subject') ? Subject.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { code: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
        ],
        // status: { $ne: 'inactive' },
      })
        .select('name code description type grade status')
        .limit(limit) : Promise.resolve([]),
    ])

    // Process results
    students.forEach((student) => {
      results.push({
        type: 'student',
        id: student._id.toString(),
        title: `${student.firstName} ${student.lastName}`,
        subtitle: student.email,
        metadata: {
          status: student.status,
        },
        url: `/dashboard/students/${student._id}`,
      })
    })

    teachers.forEach((teacher) => {
      results.push({
        type: 'teacher',
        id: teacher._id.toString(),
        title: `${teacher.firstName} ${teacher.lastName}`,
        subtitle: `${teacher.employeeId} - ${teacher.department || 'No Department'}`,
        metadata: {
          employeeId: teacher.employeeId,
          department: teacher.department,
          status: teacher.status,
        },
        url: `/dashboard/teachers/${teacher._id}`,
      })
    })

    classes.forEach((classItem) => {
      results.push({
        type: 'class',
        id: classItem._id.toString(),
        title: classItem.name,
        subtitle: `${classItem.code} - Grade ${classItem.grade} (${classItem.section})`,
        metadata: {
          code: classItem.code,
          grade: classItem.grade,
          section: classItem.section,
          capacity: classItem.capacity,
        },
        url: `/dashboard/classes/${classItem._id}`,
      })
    })

    subjects.forEach((subject) => {
      results.push({
        type: 'subject',
        id: subject._id.toString(),
        title: subject.name,
        subtitle: `${subject.code} - ${subject.type} (${subject.grade})`,
        metadata: {
          code: subject.code,
          type: subject.type,
          grade: subject.grade,
        },
        url: `/dashboard/subjects/${subject._id}`,
      })
    })

    // Sort results by relevance (exact matches first)
    results.sort((a, b) => {
      const aExact = a.title.toLowerCase() === searchTerm.toLowerCase()
      const bExact = b.title.toLowerCase() === searchTerm.toLowerCase()
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1
      return 0
    })

    // Limit total results
    const limitedResults = results.slice(0, limit)

    void sendSuccess(
      res,
      {
        query: searchTerm,
        results: limitedResults,
        total: limitedResults.length,
        byType: {
          student: limitedResults.filter((r) => r.type === 'student').length,
          teacher: limitedResults.filter((r) => r.type === 'teacher').length,
          class: limitedResults.filter((r) => r.type === 'class').length,
          subject: limitedResults.filter((r) => r.type === 'subject').length,
        },
      },
      'Search completed successfully'
    )
  } catch (error: any) {
    next(error)
  }
}
