// Teacher controllers
import { Request, Response, NextFunction } from 'express'
import { TeacherService } from '../services'
import {
  createTeacherSchema,
  updateTeacherSchema,
  teacherIdSchema,
  paginationSchema,
  assignClassesSchema,
  assignSubjectsSchema,
} from '../validators'
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse'

export const createTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, value } = createTeacherSchema.validate(req.body)
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    const teacher = await TeacherService.createTeacher(value)
    void sendSuccess(res, teacher, 'Teacher created successfully', 201)
  } catch (error: any) {
    next(error)
  }
}

export const getAllTeachers = async (
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
    const department = req.query.department as string | undefined

    const result = await TeacherService.getAllTeachers(
      page,
      limit,
      search,
      status,
      department,
      sortBy,
      sortOrder
    )

    void sendPaginated(
      res,
      result.teachers,
      result.page,
      limit,
      result.total,
      200
    )
  } catch (error: any) {
    next(error)
  }
}

export const getTeacherById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, value } = teacherIdSchema.validate({ id: req.params.id })
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    const teacher = await TeacherService.getTeacherById(value.id)
    void sendSuccess(res, teacher, 'Teacher retrieved successfully')
  } catch (error: any) {
    next(error)
  }
}

export const updateTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error: idError, value: idValue } = teacherIdSchema.validate({
      id: req.params.id,
    })
    if (idError) {
      void sendError(res, idError.details[0].message, 400)
      return
    }

    const { error, value } = updateTeacherSchema.validate(req.body)
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    const teacher = await TeacherService.updateTeacher(idValue.id, value)
    void sendSuccess(res, teacher, 'Teacher updated successfully')
  } catch (error: any) {
    next(error)
  }
}

export const deleteTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, value } = teacherIdSchema.validate({ id: req.params.id })
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    await TeacherService.deleteTeacher(value.id)
    void sendSuccess(res, null, 'Teacher deleted successfully')
  } catch (error: any) {
    next(error)
  }
}

export const assignClasses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error: idError, value: idValue } = teacherIdSchema.validate({
      id: req.params.id,
    })
    if (idError) {
      void sendError(res, idError.details[0].message, 400)
      return
    }

    const { error, value } = assignClassesSchema.validate(req.body)
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    const teacher = await TeacherService.assignClasses(idValue.id, value.classes)
    void sendSuccess(res, teacher, 'Classes assigned successfully')
  } catch (error: any) {
    next(error)
  }
}

export const assignSubjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error: idError, value: idValue } = teacherIdSchema.validate({
      id: req.params.id,
    })
    if (idError) {
      void sendError(res, idError.details[0].message, 400)
      return
    }

    const { error, value } = assignSubjectsSchema.validate(req.body)
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    const teacher = await TeacherService.assignSubjects(idValue.id, value.subjects)
    void sendSuccess(res, teacher, 'Subjects assigned successfully')
  } catch (error: any) {
    next(error)
  }
}

export const getTeacherStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await TeacherService.getTeacherStats()
    void sendSuccess(res, stats, 'Teacher statistics retrieved successfully')
  } catch (error: any) {
    next(error)
  }
}
