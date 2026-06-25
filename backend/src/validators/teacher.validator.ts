// Validation schemas for Teacher operations
import Joi from 'joi'

export const createTeacherSchema = Joi.object({
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
  employeeId: Joi.string()
    .required()
    .messages({
      'any.required': 'Employee ID is required',
    }),
  department: Joi.string()
    .optional()
    .messages({
      'string.base': 'Department must be a string',
    }),
  qualification: Joi.string()
    .optional()
    .messages({
      'string.base': 'Qualification must be a string',
    }),
  specialization: Joi.string()
    .optional()
    .messages({
      'string.base': 'Specialization must be a string',
    }),
  assignedClasses: Joi.array()
    .items(Joi.string())
    .optional()
    .messages({
      'array.base': 'Assigned classes must be an array',
    }),
  assignedSubjects: Joi.array()
    .items(Joi.string())
    .optional()
    .messages({
      'array.base': 'Assigned subjects must be an array',
    }),
  hireDate: Joi.date()
    .required()
    .messages({
      'date.base': 'Please provide a valid hire date',
      'any.required': 'Hire date is required',
    }),
  status: Joi.string()
    .valid('active', 'inactive', 'on-leave')
    .optional()
    .messages({
      'any.only': 'Status must be one of: active, inactive, on-leave',
    }),
})

export const updateTeacherSchema = Joi.object({
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
  department: Joi.string()
    .optional()
    .messages({
      'string.base': 'Department must be a string',
    }),
  qualification: Joi.string()
    .optional()
    .messages({
      'string.base': 'Qualification must be a string',
    }),
  specialization: Joi.string()
    .optional()
    .messages({
      'string.base': 'Specialization must be a string',
    }),
  assignedClasses: Joi.array()
    .items(Joi.string())
    .optional()
    .messages({
      'array.base': 'Assigned classes must be an array',
    }),
  assignedSubjects: Joi.array()
    .items(Joi.string())
    .optional()
    .messages({
      'array.base': 'Assigned subjects must be an array',
    }),
  status: Joi.string()
    .valid('active', 'inactive', 'on-leave')
    .optional()
    .messages({
      'any.only': 'Status must be one of: active, inactive, on-leave',
    }),
})

export const teacherIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid teacher ID format',
      'any.required': 'Teacher ID is required',
    }),
})

export const assignClassesSchema = Joi.object({
  classes: Joi.array()
    .items(Joi.string())
    .required()
    .messages({
      'array.base': 'Classes must be an array',
      'any.required': 'Classes are required',
    }),
})

export const assignSubjectsSchema = Joi.object({
  subjects: Joi.array()
    .items(Joi.string())
    .required()
    .messages({
      'array.base': 'Subjects must be an array',
      'any.required': 'Subjects are required',
    }),
})
