import axiosClient from "@/lib/axiosClient";
import { 
  ClassItem, CreateClassPayload, AssignTeacherPayload, ApiResponse 
} from "@/types/admin.types";

export const classService = {
  getAll: async (className?: string) => {
    return axiosClient.get<ClassItem[]>('/admin/classes', {
      params: { className }
    });
  },

  getById: async (id: string) => {
    return axiosClient.get<ClassItem>(`/admin/classes/${id}`);
  },

  create: async (data: CreateClassPayload) => {
    return axiosClient.post<ApiResponse<ClassItem>>('/admin/classes', data);
  },

  update: async (id: string, data: Partial<CreateClassPayload>) => {
    return axiosClient.put<ApiResponse<ClassItem>>(`/admin/classes/${id}`, data);
  },

  delete: async (id: string) => {
    return axiosClient.delete<ApiResponse<null>>(`/admin/classes/${id}`);
  },
};