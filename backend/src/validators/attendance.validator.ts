import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'

// Mark attendance validation schema
export const markAttendanceSchema = Joi.object({
  classId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.pattern.base': 'Invalid Class ID',
    'any.required': 'Class ID is required'
  }),
  date: Joi.date().iso().required().messages({
    'date.format': 'Invalid date format',
    'any.required': 'Date is required'
  }),
  attendance: Joi.array().min(1).items(
    Joi.object({
      studentId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).messages({
        'string.pattern.base': 'Invalid Student ID',
        'any.required': 'Student ID is required'
      }),
      status: Joi.string().required().valid('present', 'absent', 'late', 'leave').messages({
        'any.only': 'Status must be one of: present, absent, late, leave',
        'any.required': 'Status is required'
      }),
      remarks: Joi.string().optional().allow('').max(500).messages({
        'string.max': 'Remarks cannot exceed 500 characters'
      })
    })
  ).messages({
    'array.min': 'Attendance array is required and must have at least one record'
  })
})

// Update attendance validation schema
export const updateAttendanceSchema = Joi.object({
  status: Joi.string().optional().valid('present', 'absent', 'late', 'leave').messages({
    'any.only': 'Status must be one of: present, absent, late, leave'
  }),
  remarks: Joi.string().optional().allow('').max(500).messages({
    'string.max': 'Remarks cannot exceed 500 characters'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
})

// Get attendance by ID validation schema
export const getAttendanceSchema = Joi.object({
  id: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.pattern.base': 'Invalid Attendance ID',
    'any.required': 'Attendance ID is required'
  })
})

// Get attendance list validation schema
export const getAttendanceListSchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  search: Joi.string().optional().allow('').max(100).messages({
    'string.max': 'Search term cannot exceed 100 characters'
  }),
  studentId: Joi.string().optional().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.pattern.base': 'Invalid Student ID'
  }),
  classId: Joi.string().optional().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.pattern.base': 'Invalid Class ID'
  }),
  date: Joi.date().iso().optional().messages({
    'date.format': 'Invalid date format'
  }),
  status: Joi.string().optional().valid('present', 'absent', 'late', 'leave').messages({
    'any.only': 'Status must be one of: present, absent, late, leave'
  }),
  startDate: Joi.date().iso().optional().messages({
    'date.format': 'Invalid start date format'
  }),
  endDate: Joi.date().iso().optional().messages({
    'date.format': 'Invalid end date format'
  }),
  sortBy: Joi.string().optional().valid('date', 'createdAt', 'updatedAt', 'status').messages({
    'any.only': 'Invalid sort field'
  }),
  sortOrder: Joi.string().optional().valid('asc', 'desc').messages({
    'any.only': 'Sort order must be asc or desc'
  })
})

// Delete attendance validation schema
export const deleteAttendanceSchema = Joi.object({
  id: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.pattern.base': 'Invalid Attendance ID',
    'any.required': 'Attendance ID is required'
  })
})

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'params' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    })

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }))

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      })
    }

    // Replace the property with validated and sanitized value
    req[property] = value
    return next()
  }
}
