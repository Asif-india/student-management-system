// TypeScript type definitions for the backend
// This file will contain all shared types used across the backend

export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: Date
  enrollmentDate: Date
  status: 'active' | 'inactive' | 'graduated'
  createdAt: Date
  updatedAt: Date
}

export interface CreateStudentDto {
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  enrollmentDate: string
  status?: 'active' | 'inactive' | 'graduated'
}

export interface UpdateStudentDto {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  status?: 'active' | 'inactive' | 'graduated'
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
