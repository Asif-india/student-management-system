// Route controllers
export { login, logout, refreshToken, getCurrentUser } from './auth.controller'
export {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentStats,
} from './student.controller'
export {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  assignClasses,
  assignSubjects,
  getTeacherStats,
} from './teacher.controller'
export {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  assignClassTeacher,
  assignClassStudents,
  assignClassSubjects,
  getClassStats,
} from './class.controller'
export {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  assignSubjectTeachers,
  getSubjectStats,
} from './subject.controller'
