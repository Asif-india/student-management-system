// Validation schemas for Student operations
import Joi from 'joi'

export const createStudentSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required',
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required',
    }),
  phone: Joi.string()
    .pattern(/^[\d\s-()+]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
  dateOfBirth: Joi.date()
    .optional()
    .messages({
      'date.base': 'Please provide a valid date',
    }),
  enrollmentDate: Joi.date()
    .required()
    .messages({
      'date.base': 'Please provide a valid enrollment date',
      'any.required': 'Enrollment date is required',
    }),
  status: Joi.string()
    .valid('active', 'inactive', 'graduated')
    .optional()
    .messages({
      'any.only': 'Status must be one of: active, inactive, graduated',
    }),
})

export const updateStudentSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email',
    }),
  phone: Joi.string()
    .pattern(/^[\d\s-()+]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
  dateOfBirth: Joi.date()
    .optional()
    .messages({
      'date.base': 'Please provide a valid date',
    }),
  status: Joi.string()
    .valid('active', 'inactive', 'graduated')
    .optional()
    .messages({
      'any.only': 'Status must be one of: active, inactive, graduated',
    }),
})

export const studentIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid student ID format',
      'any.required': 'Student ID is required',
    }),
})

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().optional(),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
})
