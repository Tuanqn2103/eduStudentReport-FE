import axiosClient from "@/lib/axiosClient";
import {
  TeacherDashboardStats,
  MyClass,
  StudentInClass,
  StudentReport,
  UpsertReportPayload,
  Subject,
  StudentDetail, 
  UpdateStudentPayload,
  ApiResponse
} from "@/types/teacher.types";

export const teacherService = {
  getStats: async () => {
    return axiosClient.get<TeacherDashboardStats>('/teacher/stats');
  },
  getMyClasses: async () => {
    return axiosClient.get<MyClass[]>('/teacher/classes');
  },
  getClassStudents: async (classId: string, term: string) => {
    return axiosClient.get<StudentInClass[]>(`/teacher/classes/${classId}/students`, {
      params: { term }
    });
  },
  getStudentReport: async (studentId: string, term: string) => {
    return axiosClient.get<StudentReport | null>(`/teacher/reports/${studentId}`, {
      params: { term }
    });
  },
  getClassReports: async (classId: string, term: string) => {
    return axiosClient.get<StudentReport[]>('/teacher/reports', {
      params: { classId, term }
    });
  },
  saveReport: async (data: UpsertReportPayload) => {
    return axiosClient.post<ApiResponse<StudentReport>>('/teacher/reports', data);
  },
  getSubjects: async () => {
    return axiosClient.get<Subject[]>('/teacher/subjects');
  },
  deleteReport: async (reportId: string) => {
    return axiosClient.delete(`/teacher/reports/${reportId}`);
  },
  getStudentDetail: async (id: string) => {
    return axiosClient.get<StudentDetail>(`/teacher/students/${id}`);
  },
  updateStudent: async (id: string, data: UpdateStudentPayload) => {
    return axiosClient.put<ApiResponse<StudentDetail>>(`/teacher/students/${id}`, data);
  }
};