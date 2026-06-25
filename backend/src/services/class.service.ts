// Class service layer
import { Class, IClass } from '../models'
import { AppError } from '../utils/AppError'

export class ClassService {
  static async createClass(classData: Partial<IClass>): Promise<IClass> {
    try {
      const newClass = await Class.create(classData)
      return newClass
    } catch (error: any) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0]
        if (field === 'code') {
          throw new AppError('Class with this code already exists', 409)
        }
        throw new AppError('Class already exists', 409)
      }
      throw new AppError('Failed to create class', 500)
    }
  }

  static async getAllClasses(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
    grade?: string,
    academicYear?: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ classes: IClass[]; total: number; page: number; totalPages: number }> {
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

      // Academic year filter
      if (academicYear) {
        query.academicYear = academicYear
      }

      const skip = (page - 1) * limit
      const sortOptions: any = {}
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1

      const [classes, total] = await Promise.all([
        Class.find(query)
          .populate('classTeacher', 'firstName lastName email')
          .populate('students', 'firstName lastName email')
          .populate('subjects', 'name code')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit),
        Class.countDocuments(query),
      ])

      const totalPages = Math.ceil(total / limit)

      return {
        classes,
        total,
        page,
        totalPages,
      }
    } catch (error: any) {
      throw new AppError('Failed to fetch classes', 500)
    }
  }

  static async getClassById(id: string): Promise<IClass> {
    try {
      const classData = await Class.findById(id)
        .populate('classTeacher', 'firstName lastName email employeeId')
        .populate('students', 'firstName lastName email studentId')
        .populate('subjects', 'name code credits type')
      
      if (!classData) {
        throw new AppError('Class not found', 404)
      }
      return classData
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid class ID', 400)
      }
      throw new AppError('Failed to fetch class', 500)
    }
  }

  static async updateClass(
    id: string,
    updateData: Partial<IClass>
  ): Promise<IClass> {
    try {
      const classData = await Class.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate('classTeacher', 'firstName lastName email')

      if (!classData) {
        throw new AppError('Class not found', 404)
      }

      return classData
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid class ID', 400)
      }
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0]
        if (field === 'code') {
          throw new AppError('Class with this code already exists', 409)
        }
        throw new AppError('Class already exists', 409)
      }
      throw new AppError('Failed to update class', 500)
    }
  }

  static async deleteClass(id: string): Promise<void> {
    try {
      const classData = await Class.findByIdAndDelete(id)
      if (!classData) {
        throw new AppError('Class not found', 404)
      }
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid class ID', 400)
      }
      throw new AppError('Failed to delete class', 500)
    }
  }

  static async assignClassTeacher(id: string, teacherId: string): Promise<IClass> {
    try {
      const classData = await Class.findByIdAndUpdate(
        id,
        { classTeacher: teacherId },
        { new: true, runValidators: true }
      ).populate('classTeacher', 'firstName lastName email')

      if (!classData) {
        throw new AppError('Class not found', 404)
      }

      return classData
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid class ID or teacher ID', 400)
      }
      throw new AppError('Failed to assign class teacher', 500)
    }
  }

  static async assignClassStudents(id: string, studentIds: string[]): Promise<IClass> {
    try {
      const classData = await Class.findByIdAndUpdate(
        id,
        { students: studentIds },
        { new: true, runValidators: true }
      ).populate('students', 'firstName lastName email')

      if (!classData) {
        throw new AppError('Class not found', 404)
      }

      return classData
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid class ID', 400)
      }
      throw new AppError('Failed to assign students to class', 500)
    }
  }

  static async assignClassSubjects(id: string, subjectIds: string[]): Promise<IClass> {
    try {
      const classData = await Class.findByIdAndUpdate(
        id,
        { subjects: subjectIds },
        { new: true, runValidators: true }
      ).populate('subjects', 'name code')

      if (!classData) {
        throw new AppError('Class not found', 404)
      }

      return classData
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid class ID', 400)
      }
      throw new AppError('Failed to assign subjects to class', 500)
    }
  }

  static async getClassStats(): Promise<{
    total: number
    active: number
    inactive: number
    archived: number
  }> {
    try {
      const [total, active, inactive, archived] = await Promise.all([
        Class.countDocuments(),
        Class.countDocuments({ status: 'active' }),
        Class.countDocuments({ status: 'inactive' }),
        Class.countDocuments({ status: 'archived' }),
      ])

      return { total, active, inactive, archived }
    } catch (error: any) {
      throw new AppError('Failed to fetch class statistics', 500)
    }
  }
}
