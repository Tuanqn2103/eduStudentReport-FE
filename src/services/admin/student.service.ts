import axiosClient from "@/lib/axiosClient";
import { 
  Student, ImportStudentPayload, CreateStudentPayload, 
  UpdateStudentPayload, ApiResponse 
} from "@/types/admin.types";

export const studentService = {
  getByClass: async (classId: string) => {
    return axiosClient.get<Student[]>(`/admin/classes/${classId}/students`);
  },

  getById: async (id: string) => {
    return axiosClient.get<Student>(`/admin/students/${id}`);
  },

  create: async (data: CreateStudentPayload) => {
    return axiosClient.post<ApiResponse<Student>>('/admin/students', data);
  },

  import: async (data: ImportStudentPayload) => {
    return axiosClient.post<ApiResponse<{ exportData: any[] }>>('/admin/students/import', data);
  },

  update: async (id: string, data: UpdateStudentPayload) => {
    return axiosClient.put<ApiResponse<Student>>(`/admin/students/${id}`, data);
  },

  delete: async (id: string) => {
    return axiosClient.delete<ApiResponse<null>>(`/admin/students/${id}`);
  },
  resetPin: async (id: string) => {
    return axiosClient.post<ApiResponse<{ newPin: string }>>(`/admin/students/${id}/reset-pin`);
  }
};