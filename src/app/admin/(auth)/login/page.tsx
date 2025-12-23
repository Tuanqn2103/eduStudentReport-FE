"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { message } from "antd";
import AuthForm from "@/components/shared/AuthForm";
import { authService } from "@/services/auth.service";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      setLoading(true);
      const res: any = await authService.login("admin", values);

      if (!res || !res.token) {
        throw new Error("Phản hồi không hợp lệ từ server");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", res.token);
        localStorage.setItem("role", "admin");
        if (res.admin) {
          localStorage.setItem("userProfile", JSON.stringify(res.admin));
        }
      }

      message.success("Đăng nhập thành công!");
      router.push("/admin/dashboard");

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
      role="admin"
      title="Đăng nhập Quản trị"
      subtitle="Sử dụng tài khoản Admin do hệ thống cấp"
      fields={[
        { name: "phoneNumber", label: "Số điện thoại", placeholder: "09xx xxx xxx" },
        { name: "password", label: "Mật khẩu", type: "password", placeholder: "••••••••" },
      ]}
      submitLabel={loading ? "Đang xử lý..." : "Đăng nhập"}
      onSubmit={handleSubmit}
    />
  );
}