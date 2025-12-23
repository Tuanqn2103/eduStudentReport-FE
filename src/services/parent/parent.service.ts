import axiosClient from "@/lib/axiosClient";
import { Child, ReportSummary, ReportDetail } from "@/types/parent.types";

export const parentService = {
  getMyChildren: async () => {
    return axiosClient.get<Child[]>('/parent/children');
  },

  getChildReports: async (studentId: string) => {
    return axiosClient.get<ReportSummary[]>(`/parent/children/${studentId}/reports`);
  },

  getReportDetail: async (reportId: string) => {
    return axiosClient.get<ReportDetail>(`/parent/reports/${reportId}`);
  }
};