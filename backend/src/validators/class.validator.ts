// Validation schemas for Class operations
import Joi from 'joi'

export const createClassSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Class name is required',
    }),
  code: Joi.string()
    .required()
    .messages({
      'any.required': 'Class code is required',
    }),
  grade: Joi.string()
    .required()
    .messages({
      'any.required': 'Grade is required',
    }),
  section: Joi.string()
    .required()
    .messages({
      'any.required': 'Section is required',
    }),
  academicYear: Joi.string()
    .required()
    .messages({
      'any.required': 'Academic year is required',
    }),
  classTeacher: Joi.string()
    .optional()
    .messages({
      'string.base': 'Class teacher must be a string',
    }),
  students: Joi.array()
    .items(Joi.string())
    .optional()
    .messages({
      'array.base': 'Students must be an array',
    }),
  subjects: Joi.array()
    .items(Joi.string())
    .optional()
    .messages({
      'array.base': 'Subjects must be an array',
    }),
  capacity: Joi.number()
    .min(1)
    .required()
    .messages({
      'number.min': 'Capacity must be at least 1',
      'any.required': 'Capacity is required',
    }),
  status: Joi.string()
    .valid('active', 'inactive', 'archived')
    .optional()
    .messages({
      'any.only': 'Status must be one of: active, inactive, archived',
    }),
})

export const updateClassSchema = Joi.object({
  name: Joi.string()
    .optional()
    .messages({
      'string.base': 'Class name must be a string',
    }),
  code: Joi.string()
    .optional()
    .messages({
      'string.base': 'Class code must be a string',
    }),
  grade: Joi.string()
    .optional()
    .messages({
      'string.base': 'Grade must be a string',
    }),
  section: Joi.string()
    .optional()
    .messages({
      'string.base': 'Section must be a string',
    }),
  academicYear: Joi.string()
    .optional()
    .messages({
      'string.base': 'Academic year must be a string',
    }),
  classTeacher: Joi.string()
    .optional()
    .messages({
      'string.base': 'Class teacher must be a string',
    }),
  students: Joi.array()
    .items(Joi.string())
    .optional()
    .messages({
      'array.base': 'Students must be an array',
    }),
  subjects: Joi.array()
    .items(Joi.string())
    .optional()
    .messages({
      'array.base': 'Subjects must be an array',
    }),
  capacity: Joi.number()
    .min(1)
    .optional()
    .messages({
      'number.min': 'Capacity must be at least 1',
    }),
  status: Joi.string()
    .valid('active', 'inactive', 'archived')
    .optional()
    .messages({
      'any.only': 'Status must be one of: active, inactive, archived',
    }),
})

export const classIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid class ID format',
      'any.required': 'Class ID is required',
    }),
})

export const assignClassTeacherSchema = Joi.object({
  teacherId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid teacher ID format',
      'any.required': 'Teacher ID is required',
    }),
})

export const assignClassStudentsSchema = Joi.object({
  studentIds: Joi.array()
    .items(Joi.string())
    .required()
    .messages({
      'array.base': 'Student IDs must be an array',
      'any.required': 'Student IDs are required',
    }),
})

export const assignClassSubjectsSchema = Joi.object({
  subjectIds: Joi.array()
    .items(Joi.string())
    .required()
    .messages({
      'array.base': 'Subject IDs must be an array',
      'any.required': 'Subject IDs are required',
    }),
})
