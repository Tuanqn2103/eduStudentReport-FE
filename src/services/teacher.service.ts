import axiosClient from "@/lib/axiosClient";

export const teacherService = {
  getDashboard: () => axiosClient.get("/teacher/dashboard"),
  getClassStudents: (classId: string) => axiosClient.get(`/teacher/class/${classId}`),
  getStudentScores: (studentId: string) => axiosClient.get(`/teacher/score/${studentId}`),
  upsertScores: (studentId: string, body: any) => axiosClient.post(`/teacher/score/${studentId}`, body),
  getReports: () => axiosClient.get("/teacher/reports"),
};

