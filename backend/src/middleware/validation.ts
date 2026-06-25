// Validation middleware using Joi
import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { AppError } from './errorHandler'

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errors = error.details.map((detail) => detail.message)
      return next(new AppError(errors.join(', '), 400))
    }

    next()
  }
}

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errors = error.details.map((detail) => detail.message)
      return next(new AppError(errors.join(', '), 400))
    }

    next()
  }
}

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errors = error.details.map((detail) => detail.message)
      return next(new AppError(errors.join(', '), 400))
    }

    next()
  }
}
