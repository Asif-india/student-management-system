// Validation schemas for Subject operations
import Joi from 'joi'

export const createSubjectSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Subject name is required',
    }),
  code: Joi.string()
    .required()
    .messages({
      'any.required': 'Subject code is required',
    }),
  description: Joi.string()
    .optional()
    .messages({
      'string.base': 'Description must be a string',
    }),
  credits: Joi.number()
    .min(1)
    .max(10)
    .required()
    .messages({
      'number.min': 'Credits must be at least 1',
      'number.max': 'Credits cannot exceed 10',
      'any.required': 'Credits are required',
    }),
  type: Joi.string()
    .valid('core', 'elective', 'optional')
    .optional()
    .messages({
      'any.only': 'Type must be one of: core, elective, optional',
    }),
  grade: Joi.string()
    .required()
    .messages({
      'any.required': 'Grade is required',
    }),
  assignedTeachers: Joi.array()
    .items(Joi.string())
    .optional()
    .messages({
      'array.base': 'Assigned teachers must be an array',
    }),
  status: Joi.string()
    .valid('active', 'inactive')
    .optional()
    .messages({
      'any.only': 'Status must be one of: active, inactive',
    }),
})

export const updateSubjectSchema = Joi.object({
  name: Joi.string()
    .optional()
    .messages({
      'string.base': 'Subject name must be a string',
    }),
  code: Joi.string()
    .optional()
    .messages({
      'string.base': 'Subject code must be a string',
    }),
  description: Joi.string()
    .optional()
    .messages({
      'string.base': 'Description must be a string',
    }),
  credits: Joi.number()
    .min(1)
    .max(10)
    .optional()
    .messages({
      'number.min': 'Credits must be at least 1',
      'number.max': 'Credits cannot exceed 10',
    }),
  type: Joi.string()
    .valid('core', 'elective', 'optional')
    .optional()
    .messages({
      'any.only': 'Type must be one of: core, elective, optional',
    }),
  grade: Joi.string()
    .optional()
    .messages({
      'string.base': 'Grade must be a string',
    }),
  assignedTeachers: Joi.array()
    .items(Joi.string())
    .optional()
    .messages({
      'array.base': 'Assigned teachers must be an array',
    }),
  status: Joi.string()
    .valid('active', 'inactive')
    .optional()
    .messages({
      'any.only': 'Status must be one of: active, inactive',
    }),
})

export const subjectIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid subject ID format',
      'any.required': 'Subject ID is required',
    }),
})

export const assignSubjectTeachersSchema = Joi.object({
  teacherIds: Joi.array()
    .items(Joi.string())
    .required()
    .messages({
      'array.base': 'Teacher IDs must be an array',
      'any.required': 'Teacher IDs are required',
    }),
})
