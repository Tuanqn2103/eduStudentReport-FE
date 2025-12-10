import axiosClient from "@/lib/axiosClient";
import { DashboardStats } from "@/types/admin.types";

export const dashboardService = {
  getStats: async () => {
    return axiosClient.get<DashboardStats>('/admin/stats');
  }
};