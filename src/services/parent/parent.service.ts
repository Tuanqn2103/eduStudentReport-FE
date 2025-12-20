import axiosClient from "@/lib/axiosClient";
import { Child, ReportSummary, ReportDetail } from "@/types/parent.types";

export const parentService = {
  // Lấy danh sách con và thông tin GVCN
  getMyChildren: async () => {
    return axiosClient.get<Child[]>('/parent/children');
  },

  // Lấy danh sách báo cáo của 1 học sinh
  getChildReports: async (studentId: string) => {
    return axiosClient.get<ReportSummary[]>(`/parent/children/${studentId}/reports`);
  },

  // Xem chi tiết 1 bảng điểm
  getReportDetail: async (reportId: string) => {
    return axiosClient.get<ReportDetail>(`/parent/reports/${reportId}`);
  }
};