"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthForm from "@/components/shared/AuthForm";
import { authService } from "@/services/auth.service";
import { message } from "antd";

export default function ParentLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); 
  
  const handleSubmit = async (values: Record<string, string>) => {
    try {
      setLoading(true);
      const res: any = await authService.login("parent", values);

      if (!res || !res.token) {
        throw new Error("Phản hồi không hợp lệ từ server");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", res.token);
        localStorage.setItem("role", "parent");
        
        if (res.student) {
          localStorage.setItem("userProfile", JSON.stringify(res.student));
        }
      }

      message.success("Đăng nhập thành công!");
      router.push("/parent/dashboard");

    } catch (error: any) {
      console.error("Login Error:", error);
      const msg = error.message || error.response?.data?.message || "Đăng nhập thất bại";
      message.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      role="parent"
      title="Đăng nhập Phụ huynh"
      subtitle="Nhập số điện thoại và mã PIN do giáo viên cấp"
      fields={[
        { name: "phoneNumber", label: "Số điện thoại", placeholder: "09xx xxx xxx" },
        { name: "pin", label: "Mã PIN", type: "password", placeholder: "••••" },
      ]}
      onSubmit={handleSubmit}
    />
  );
}