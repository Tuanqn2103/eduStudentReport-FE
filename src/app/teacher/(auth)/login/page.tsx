"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthForm from "@/components/shared/AuthForm";
import { authService } from "@/services/auth.service";

export default function TeacherLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); 
  
  const handleSubmit = async (values: Record<string, string>) => {
    try {
      setLoading(true);
      const res: any = await authService.login("teacher", values);

      if (!res || !res.token) {
        throw new Error("Phản hồi không hợp lệ từ server");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", res.token);
        localStorage.setItem("role", "teacher");
        if (res.admin) {
          localStorage.setItem("userProfile", JSON.stringify(res.admin));
        }
      }

      router.push("/teacher/dashboard");

    } catch (error: any) {
      console.error("Login Error:", error);
      const errorMessage = error.message || "Đăng nhập thất bại";
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      role="teacher"
      title="Đăng nhập Giáo viên"
      subtitle="Nhập SĐT và mật khẩu do Admin cấp"
      fields={[
        { name: "phoneNumber", label: "Số điện thoại", placeholder: "09xx xxx xxx" },
        { name: "password", label: "Mật khẩu", type: "password", placeholder: "••••••••" },
      ]}
      onSubmit={handleSubmit}
    />
  );
}

