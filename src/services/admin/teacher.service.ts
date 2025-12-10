import axiosClient from "@/lib/axiosClient";
import { 
  Teacher, CreateTeacherPayload, UpdateTeacherPayload, ApiResponse 
} from "@/types/admin.types";

export const teacherService = {
  getAll: async (phoneNumber?: string) => {
    return axiosClient.get<Teacher[]>('/admin/teachers', { 
      params: { phoneNumber } 
    });
  },
  
  getById: async (id: string) => {
    return axiosClient.get<Teacher>(`/admin/teachers/${id}`);
  },

  create: async (data: CreateTeacherPayload) => {
    return axiosClient.post<ApiResponse<Teacher>>('/admin/teachers', data);
  },

  update: async (id: string, data: UpdateTeacherPayload) => {
    return axiosClient.put<ApiResponse<Teacher>>(`/admin/teachers/${id}`, data);
  },

  delete: async (id: string) => {
    return axiosClient.delete<ApiResponse<null>>(`/admin/teachers/${id}`);
  }
};