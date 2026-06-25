// Student controllers
import { Request, Response, NextFunction } from 'express'
import { StudentService } from '../services'
import { createStudentSchema, updateStudentSchema, studentIdSchema, paginationSchema } from '../validators'
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse'

export const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, value } = createStudentSchema.validate(req.body)
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    const student = await StudentService.createStudent(value)
    void sendSuccess(res, student, 'Student created successfully', 201)
  } catch (error: any) {
    next(error)
  }
}

export const getAllStudents = async (
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

    const result = await StudentService.getAllStudents(
      page,
      limit,
      search,
      status,
      sortBy,
      sortOrder
    )

    void sendPaginated(
      res,
      result.students,
      result.page,
      limit,
      result.total,
      200
    )
  } catch (error: any) {
    next(error)
  }
}

export const getStudentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, value } = studentIdSchema.validate({ id: req.params.id })
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    const student = await StudentService.getStudentById(value.id)
    void sendSuccess(res, student, 'Student retrieved successfully')
  } catch (error: any) {
    next(error)
  }
}

export const updateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error: idError, value: idValue } = studentIdSchema.validate({
      id: req.params.id,
    })
    if (idError) {
      void sendError(res, idError.details[0].message, 400)
      return
    }

    const { error, value } = updateStudentSchema.validate(req.body)
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    const student = await StudentService.updateStudent(idValue.id, value)
    void sendSuccess(res, student, 'Student updated successfully')
  } catch (error: any) {
    next(error)
  }
}

export const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, value } = studentIdSchema.validate({ id: req.params.id })
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    await StudentService.deleteStudent(value.id)
    void sendSuccess(res, null, 'Student deleted successfully')
  } catch (error: any) {
    next(error)
  }
}

export const getStudentStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await StudentService.getStudentStats()
    void sendSuccess(res, stats, 'Student statistics retrieved successfully')
  } catch (error: any) {
    next(error)
  }
}
