import axiosClient from "@/lib/axiosClient";
import { 
  Teacher, CreateTeacherPayload, UpdateTeacherPayload,
  ClassItem, CreateClassPayload, AssignTeacherPayload,
  Student, ImportStudentPayload, CreateStudentPayload, UpdateStudentPayload,
  DashboardStats, Subject, CreateSubjectPayload, ApiResponse
} from "@/types/admin.types";

export const adminService = {
  // --- TEACHER ---
  getTeachers: async (phoneNumber?: string) => {
    return axiosClient.get<Teacher[]>('/admin/teachers', { 
      params: { phoneNumber } 
    });
  },
  
  getTeacherById: async (id: string) => {
    return axiosClient.get<Teacher>(`/admin/teachers/${id}`);
  },

  createTeacher: async (data: CreateTeacherPayload) => {
    return axiosClient.post<ApiResponse<Teacher>>('/admin/teachers', data);
  },

  updateTeacher: async (id: string, data: UpdateTeacherPayload) => {
    return axiosClient.put<ApiResponse<Teacher>>(`/admin/teachers/${id}`, data);
  },

  deleteTeacher: async (id: string) => {
    return axiosClient.delete<ApiResponse<null>>(`/admin/teachers/${id}`);
  },

  // --- CLASS ---
  getClasses: async (className?: string) => {
    return axiosClient.get<ClassItem[]>('/admin/classes', {
      params: { className }
    });
  },

  getClassById: async (id: string) => {
    return axiosClient.get<ClassItem>(`/admin/classes/${id}`);
  },

  createClass: async (data: CreateClassPayload) => {
    return axiosClient.post<ApiResponse<ClassItem>>('/admin/classes', data);
  },

  updateClass: async (id: string, data: Partial<CreateClassPayload>) => {
    return axiosClient.put<ApiResponse<ClassItem>>(`/admin/classes/${id}`, data);
  },

  deleteClass: async (id: string) => {
    return axiosClient.delete<ApiResponse<null>>(`/admin/classes/${id}`);
  },

  assignTeacher: async (data: AssignTeacherPayload) => {
    return axiosClient.post<ApiResponse<null>>('/admin/assign', data);
  },

  // --- STUDENT ---
  getStudentsByClass: async (classId: string) => {
    return axiosClient.get<Student[]>(`/admin/classes/${classId}/students`);
  },

  getStudentById: async (id: string) => {
    return axiosClient.get<Student>(`/admin/students/${id}`);
  },

  createStudent: async (data: CreateStudentPayload) => {
    return axiosClient.post<ApiResponse<Student>>('/admin/students', data);
  },

  importStudents: async (data: ImportStudentPayload) => {
    return axiosClient.post<ApiResponse<{ exportData: any[] }>>('/admin/students/import', data);
  },

  updateStudent: async (id: string, data: UpdateStudentPayload) => {
    return axiosClient.put<ApiResponse<Student>>(`/admin/students/${id}`, data);
  },

  deleteStudent: async (id: string) => {
    return axiosClient.delete<ApiResponse<null>>(`/admin/students/${id}`);
  },

  // --- SUBJECT ---
  getSubjects: async () => {
    return axiosClient.get<Subject[]>('/admin/subjects');
  },

  createSubject: async (data: CreateSubjectPayload) => {
    return axiosClient.post<ApiResponse<Subject>>('/admin/subjects', data);
  },

  // --- DASHBOARD ---
  getStats: async () => {
    return axiosClient.get<DashboardStats>('/admin/stats');
  }
};