// Subject controllers
import { Request, Response, NextFunction } from 'express'
import { SubjectService } from '../services/subject.service'
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse'
import {
  createSubjectSchema,
  updateSubjectSchema,
  subjectIdSchema,
  paginationSchema,
  assignSubjectTeachersSchema,
} from '../validators'

export const createSubject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, value } = createSubjectSchema.validate(req.body)
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    const subject = await SubjectService.createSubject(value)
    void sendSuccess(res, subject, 'Subject created successfully', 201)
  } catch (error) {
    next(error)
  }
}

export const getAllSubjects = async (
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
    const type = req.query.type as string | undefined

    const result = await SubjectService.getAllSubjects(
      page,
      limit,
      search,
      status,
      grade,
      type,
      sortBy,
      sortOrder
    )

    void sendPaginated(
      res,
      result.subjects,
      result.page,
      limit,
      result.total,
      200
    )
  } catch (error) {
    next(error)
  }
}

export const getSubjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, value } = subjectIdSchema.validate({ id: req.params.id })
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    const subject = await SubjectService.getSubjectById(value.id)
    void sendSuccess(res, subject, 'Subject retrieved successfully')
  } catch (error) {
    next(error)
  }
}

export const updateSubject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error: idError, value: idValue } = subjectIdSchema.validate({
      id: req.params.id,
    })
    if (idError) {
      void sendError(res, idError.details[0].message, 400)
      return
    }

    const { error, value } = updateSubjectSchema.validate(req.body)
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    const subject = await SubjectService.updateSubject(idValue.id, value)
    void sendSuccess(res, subject, 'Subject updated successfully')
  } catch (error) {
    next(error)
  }
}

export const deleteSubject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, value } = subjectIdSchema.validate({ id: req.params.id })
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    await SubjectService.deleteSubject(value.id)
    void sendSuccess(res, null, 'Subject deleted successfully')
  } catch (error) {
    next(error)
  }
}

export const assignSubjectTeachers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error: idError, value: idValue } = subjectIdSchema.validate({
      id: req.params.id,
    })
    if (idError) {
      void sendError(res, idError.details[0].message, 400)
      return
    }

    const { error, value } = assignSubjectTeachersSchema.validate(req.body)
    if (error) {
      void sendError(res, error.details[0].message, 400)
      return
    }

    const subject = await SubjectService.assignSubjectTeachers(
      idValue.id,
      value.teacherIds
    )
    void sendSuccess(res, subject, 'Teachers assigned to subject successfully')
  } catch (error) {
    next(error)
  }
}

export const getSubjectStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await SubjectService.getSubjectStats()
    void sendSuccess(res, stats, 'Subject statistics retrieved successfully')
  } catch (error) {
    next(error)
  }
}
