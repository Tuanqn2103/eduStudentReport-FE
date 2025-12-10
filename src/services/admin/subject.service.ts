import axiosClient from "@/lib/axiosClient";
import { Subject, CreateSubjectPayload, ApiResponse } from "@/types/admin.types";

export const subjectService = {
  getAll: async () => {
    return axiosClient.get<Subject[]>('/admin/subjects');
  },

  create: async (data: CreateSubjectPayload) => {
    return axiosClient.post<ApiResponse<Subject>>('/admin/subjects', data);
  },
};