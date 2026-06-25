// Class controllers
import { Request, Response, NextFunction } from 'express'
import { ClassService } from '../services/class.service'
import { AppError } from '../utils/AppError'
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse'
import {
  createClassSchema,
  updateClassSchema,
  classIdSchema,
  paginationSchema,
  assignClassTeacherSchema,
  assignClassStudentsSchema,
  assignClassSubjectsSchema,
} from '../validators'

export const createClass = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error } = createClassSchema.validate(req.body)
    if (error) {
      throw new AppError(error.details[0].message, 400)
    }

    const classData = await ClassService.createClass(req.body)
    void sendSuccess(res, classData, 'Class created successfully', 201)
  } catch (error) {
    next(error)
  }
}

export const getAllClasses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, value } = paginationSchema.validate(req.query)
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    const { page, limit, sortBy, sortOrder } = value
    const search = req.query.search as string | undefined
    const status = req.query.status as string | undefined
    const grade = req.query.grade as string | undefined
    const academicYear = req.query.academicYear as string | undefined

    const result = await ClassService.getAllClasses(
      page,
      limit,
      search,
      status,
      grade,
      academicYear,
      sortBy,
      sortOrder
    )

    void sendPaginated(
      res,
      result.classes,
      result.page,
      limit,
      result.total,
      200
    )
  } catch (error) {
    next(error)
  }
}

export const getClassById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, value } = classIdSchema.validate({ id: req.params.id })
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    const classData = await ClassService.getClassById(value.id)
    void sendSuccess(res, classData, 'Class retrieved successfully')
  } catch (error) {
    next(error)
  }
}

export const updateClass = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error: idError, value: idValue } = classIdSchema.validate({
      id: req.params.id,
    })
    if (idError) {
      void sendError(res, idError.details[0].message, 400)
      return
    }

    const { error, value } = updateClassSchema.validate(req.body)
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    const classData = await ClassService.updateClass(idValue.id, value)
    void sendSuccess(res, classData, 'Class updated successfully')
  } catch (error) {
    next(error)
  }
}

export const deleteClass = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, value } = classIdSchema.validate({ id: req.params.id })
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    await ClassService.deleteClass(value.id)
    void sendSuccess(res, null, 'Class deleted successfully')
  } catch (error) {
    next(error)
  }
}

export const assignClassTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error: idError, value: idValue } = classIdSchema.validate({
      id: req.params.id,
    })
    if (idError) {
      void sendError(res, idError.details[0].message, 400)
      return
    }

    const { error, value } = assignClassTeacherSchema.validate(req.body)
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    const classData = await ClassService.assignClassTeacher(
      idValue.id,
      value.teacherId
    )
    void sendSuccess(res, classData, 'Class teacher assigned successfully')
  } catch (error) {
    next(error)
  }
}

export const assignClassStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error: idError, value: idValue } = classIdSchema.validate({
      id: req.params.id,
    })
    if (idError) {
      void sendError(res, idError.details[0].message, 400)
      return
    }

    const { error, value } = assignClassStudentsSchema.validate(req.body)
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    const classData = await ClassService.assignClassStudents(
      idValue.id,
      value.studentIds
    )
    void sendSuccess(res, classData, 'Students assigned to class successfully')
  } catch (error) {
    next(error)
  }
}

export const assignClassSubjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error: idError, value: idValue } = classIdSchema.validate({
      id: req.params.id,
    })
    if (idError) {
      void sendError(res, idError.details[0].message, 400)
      return
    }

    const { error, value } = assignClassSubjectsSchema.validate(req.body)
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    const classData = await ClassService.assignClassSubjects(
      idValue.id,
      value.subjectIds
    )
    void sendSuccess(res, classData, 'Subjects assigned to class successfully')
  } catch (error) {
    next(error)
  }
}

export const getClassStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await ClassService.getClassStats()
    void sendSuccess(res, stats, 'Class statistics retrieved successfully')
  } catch (error) {
    next(error)
  }
}
