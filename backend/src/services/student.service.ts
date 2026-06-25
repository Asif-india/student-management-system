// Student service layer
import { Student } from '../models'
import { IStudent } from '../models/Student.model'
import { AppError } from '../utils/AppError'

export class StudentService {
  static async createStudent(studentData: Partial<IStudent>): Promise<IStudent> {
    try {
      const student = await Student.create(studentData)
      return student
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError('Student with this email already exists', 409)
      }
      throw new AppError('Failed to create student', 500)
    }
  }

  static async getAllStudents(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ students: IStudent[]; total: number; page: number; totalPages: number }> {
    try {
      const query: any = {}

      // Search filter
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ]
      }

      // Status filter
      if (status) {
        query.status = status
      }

      const skip = (page - 1) * limit
      const sortOptions: any = {}
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1

      const [students, total] = await Promise.all([
        Student.find(query).sort(sortOptions).skip(skip).limit(limit),
        Student.countDocuments(query),
      ])

      const totalPages = Math.ceil(total / limit)

      return {
        students,
        total,
        page,
        totalPages,
      }
    } catch (error: any) {
      throw new AppError('Failed to fetch students', 500)
    }
  }

  static async getStudentById(id: string): Promise<IStudent> {
    try {
      const student = await Student.findById(id)
      if (!student) {
        throw new AppError('Student not found', 404)
      }
      return student
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid student ID', 400)
      }
      throw new AppError('Failed to fetch student', 500)
    }
  }

  static async updateStudent(
    id: string,
    updateData: Partial<IStudent>
  ): Promise<IStudent> {
    try {
      const student = await Student.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })

      if (!student) {
        throw new AppError('Student not found', 404)
      }

      return student
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid student ID', 400)
      }
      if (error.code === 11000) {
        throw new AppError('Student with this email already exists', 409)
      }
      throw new AppError('Failed to update student', 500)
    }
  }

  static async deleteStudent(id: string): Promise<void> {
    try {
      const student = await Student.findByIdAndDelete(id)
      if (!student) {
        throw new AppError('Student not found', 404)
      }
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid student ID', 400)
      }
      throw new AppError('Failed to delete student', 500)
    }
  }

  static async getStudentStats(): Promise<{
    total: number
    active: number
    inactive: number
    graduated: number
  }> {
    try {
      const [total, active, inactive, graduated] = await Promise.all([
        Student.countDocuments(),
        Student.countDocuments({ status: 'active' }),
        Student.countDocuments({ status: 'inactive' }),
        Student.countDocuments({ status: 'graduated' }),
      ])

      return { total, active, inactive, graduated }
    } catch (error: any) {
      throw new AppError('Failed to fetch student statistics', 500)
    }
  }
}
