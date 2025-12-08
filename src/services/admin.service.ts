import axiosClient from "@/lib/axiosClient";

export const adminService = {
  getDashboard: () => axiosClient.get("/admin/dashboard"),
  getTeachers: () => axiosClient.get<{ teachers: any[] }>("/admin/teachers"),
  createTeacher: (body: any) => axiosClient.post("/admin/teachers", body),
  updateTeacher: (id: string, body: any) => axiosClient.put(`/admin/teachers/${id}`, body),
  deleteTeacher: (id: string) => axiosClient.delete(`/admin/teachers/${id}`),
  getStudents: () => axiosClient.get("/admin/students"),
  getClasses: () => axiosClient.get("/admin/classes"),
  updateSettings: (body: any) => axiosClient.put("/admin/settings", body),
};

