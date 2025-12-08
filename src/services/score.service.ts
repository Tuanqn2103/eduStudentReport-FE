import axiosClient from "@/lib/axiosClient";

export const scoreService = {
  getScoreByStudent: (studentId: string) => axiosClient.get(`/score/${studentId}`),
  exportScorePdf: (studentId: string) => axiosClient.get(`/score/${studentId}/pdf`, { responseType: "blob" }),
};

