import axiosClient from "@/lib/axiosClient";

export const authService = {
  login: async (role: 'admin' | 'teacher' | 'parent', body: any) => {
    return axiosClient.post(`/${role}/login`, body);
  },
  logout: async (role: string) => {
    return axiosClient.post(`/${role}/logout`);
  },
  getMe: async (role: 'admin' | 'teacher' | 'parent') => {
    return axiosClient.get(`/${role}/me`);
  }
};