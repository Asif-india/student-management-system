// Teacher service layer
import { Teacher } from '../models'
import type { ITeacher } from '../models'
import { AppError } from '../utils/AppError'

export class TeacherService {
  static async createTeacher(teacherData: Partial<ITeacher>): Promise<ITeacher> {
    try {
      const teacher = await Teacher.create(teacherData)
      return teacher
    } catch (error: any) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0]
        if (field === 'email') {
          throw new AppError('Teacher with this email already exists', 409)
        }
        if (field === 'employeeId') {
          throw new AppError('Teacher with this employee ID already exists', 409)
        }
        throw new AppError('Teacher already exists', 409)
      }
      throw new AppError('Failed to create teacher', 500)
    }
  }

  static async getAllTeachers(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
    department?: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ teachers: ITeacher[]; total: number; page: number; totalPages: number }> {
    try {
      const query: any = {}

      // Search filter
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { employeeId: { $regex: search, $options: 'i' } },
        ]
      }

      // Status filter
      if (status) {
        query.status = status
      }

      // Department filter
      if (department) {
        query.department = { $regex: department, $options: 'i' }
      }

      const skip = (page - 1) * limit
      const sortOptions: any = {}
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1

      const [teachers, total] = await Promise.all([
        Teacher.find(query).sort(sortOptions).skip(skip).limit(limit),
        Teacher.countDocuments(query),
      ])

      const totalPages = Math.ceil(total / limit)

      return {
        teachers,
        total,
        page,
        totalPages,
      }
    } catch (error: any) {
      throw new AppError('Failed to fetch teachers', 500)
    }
  }

  static async getTeacherById(id: string): Promise<ITeacher> {
    try {
      const teacher = await Teacher.findById(id)
      if (!teacher) {
        throw new AppError('Teacher not found', 404)
      }
      return teacher
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid teacher ID', 400)
      }
      throw new AppError('Failed to fetch teacher', 500)
    }
  }

  static async updateTeacher(
    id: string,
    updateData: Partial<ITeacher>
  ): Promise<ITeacher> {
    try {
      const teacher = await Teacher.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })

      if (!teacher) {
        throw new AppError('Teacher not found', 404)
      }

      return teacher
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid teacher ID', 400)
      }
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0]
        if (field === 'email') {
          throw new AppError('Teacher with this email already exists', 409)
        }
        throw new AppError('Teacher already exists', 409)
      }
      throw new AppError('Failed to update teacher', 500)
    }
  }

  static async deleteTeacher(id: string): Promise<void> {
    try {
      const teacher = await Teacher.findByIdAndDelete(id)
      if (!teacher) {
        throw new AppError('Teacher not found', 404)
      }
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid teacher ID', 400)
      }
      throw new AppError('Failed to delete teacher', 500)
    }
  }

  static async assignClasses(id: string, classes: string[]): Promise<ITeacher> {
    try {
      const teacher = await Teacher.findByIdAndUpdate(
        id,
        { assignedClasses: classes },
        { new: true, runValidators: true }
      )

      if (!teacher) {
        throw new AppError('Teacher not found', 404)
      }

      return teacher
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid teacher ID', 400)
      }
      throw new AppError('Failed to assign classes', 500)
    }
  }

  static async assignSubjects(id: string, subjects: string[]): Promise<ITeacher> {
    try {
      const teacher = await Teacher.findByIdAndUpdate(
        id,
        { assignedSubjects: subjects },
        { new: true, runValidators: true }
      )

      if (!teacher) {
        throw new AppError('Teacher not found', 404)
      }

      return teacher
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid teacher ID', 400)
      }
      throw new AppError('Failed to assign subjects', 500)
    }
  }

  static async getTeacherStats(): Promise<{
    total: number
    active: number
    inactive: number
    onLeave: number
  }> {
    try {
      const [total, active, inactive, onLeave] = await Promise.all([
        Teacher.countDocuments(),
        Teacher.countDocuments({ status: 'active' }),
        Teacher.countDocuments({ status: 'inactive' }),
        Teacher.countDocuments({ status: 'on-leave' }),
      ])

      return { total, active, inactive, onLeave }
    } catch (error: any) {
      throw new AppError('Failed to fetch teacher statistics', 500)
    }
  }
}
