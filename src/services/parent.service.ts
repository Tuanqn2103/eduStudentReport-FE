import axiosClient from "@/lib/axiosClient";

export const parentService = {
  getScores: async () => axiosClient.get("/parent/scores"),
  downloadScoresPdf: async () => axiosClient.get("/parent/scores/pdf", { responseType: "blob" }),
};

