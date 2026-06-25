// Subject service layer
import { Subject, ISubject } from '../models'
import { AppError } from '../utils/AppError'

export class SubjectService {
  static async createSubject(subjectData: Partial<ISubject>): Promise<ISubject> {
    try {
      const subject = await Subject.create(subjectData)
      return subject
    } catch (error: any) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0]
        if (field === 'code') {
          throw new AppError('Subject with this code already exists', 409)
        }
        throw new AppError('Subject already exists', 409)
      }
      throw new AppError('Failed to create subject', 500)
    }
  }

  static async getAllSubjects(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
    grade?: string,
    type?: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ subjects: ISubject[]; total: number; page: number; totalPages: number }> {
    try {
      const query: any = {}

      // Search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
        ]
      }

      // Status filter
      if (status) {
        query.status = status
      }

      // Grade filter
      if (grade) {
        query.grade = grade
      }

      // Type filter
      if (type) {
        query.type = type
      }

      const skip = (page - 1) * limit
      const sortOptions: any = {}
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1

      const [subjects, total] = await Promise.all([
        Subject.find(query)
          .populate('assignedTeachers', 'firstName lastName email employeeId')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit),
        Subject.countDocuments(query),
      ])

      const totalPages = Math.ceil(total / limit)

      return {
        subjects,
        total,
        page,
        totalPages,
      }
    } catch (error: any) {
      throw new AppError('Failed to fetch subjects', 500)
    }
  }

  static async getSubjectById(id: string): Promise<ISubject> {
    try {
      const subject = await Subject.findById(id)
        .populate('assignedTeachers', 'firstName lastName email employeeId')
      
      if (!subject) {
        throw new AppError('Subject not found', 404)
      }
      return subject
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid subject ID', 400)
      }
      throw new AppError('Failed to fetch subject', 500)
    }
  }

  static async updateSubject(
    id: string,
    updateData: Partial<ISubject>
  ): Promise<ISubject> {
    try {
      const subject = await Subject.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })

      if (!subject) {
        throw new AppError('Subject not found', 404)
      }

      return subject
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid subject ID', 400)
      }
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0]
        if (field === 'code') {
          throw new AppError('Subject with this code already exists', 409)
        }
        throw new AppError('Subject already exists', 409)
      }
      throw new AppError('Failed to update subject', 500)
    }
  }

  static async deleteSubject(id: string): Promise<void> {
    try {
      const subject = await Subject.findByIdAndDelete(id)
      if (!subject) {
        throw new AppError('Subject not found', 404)
      }
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid subject ID', 400)
      }
      throw new AppError('Failed to delete subject', 500)
    }
  }

  static async assignSubjectTeachers(id: string, teacherIds: string[]): Promise<ISubject> {
    try {
      const subject = await Subject.findByIdAndUpdate(
        id,
        { assignedTeachers: teacherIds },
        { new: true, runValidators: true }
      ).populate('assignedTeachers', 'firstName lastName email')

      if (!subject) {
        throw new AppError('Subject not found', 404)
      }

      return subject
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid subject ID', 400)
      }
      throw new AppError('Failed to assign teachers to subject', 500)
    }
  }

  static async getSubjectStats(): Promise<{
    total: number
    active: number
    inactive: number
    core: number
    elective: number
    optional: number
  }> {
    try {
      const [total, active, inactive, core, elective, optional] = await Promise.all([
        Subject.countDocuments(),
        Subject.countDocuments({ status: 'active' }),
        Subject.countDocuments({ status: 'inactive' }),
        Subject.countDocuments({ type: 'core' }),
        Subject.countDocuments({ type: 'elective' }),
        Subject.countDocuments({ type: 'optional' }),
      ])

      return { total, active, inactive, core, elective, optional }
    } catch (error: any) {
      throw new AppError('Failed to fetch subject statistics', 500)
    }
  }
}
