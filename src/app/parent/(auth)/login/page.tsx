"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthForm from "@/components/shared/AuthForm";
import { authService } from "@/services/auth.service";
import { message } from "antd"; // 1. Thêm import message

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
        
        // 2. Sửa res.admin thành res.student (theo logic backend parent login)
        if (res.student) {
          localStorage.setItem("userProfile", JSON.stringify(res.student));
        }
      }

      // 3. Thêm thông báo thành công
      message.success("Đăng nhập thành công!");
      router.push("/parent/dashboard");

    } catch (error: any) {
      console.error("Login Error:", error);
      // AuthForm sẽ bắt lỗi này để hiển thị, nhưng nếu muốn hiển thị toast thì:
      const msg = error.message || error.response?.data?.message || "Đăng nhập thất bại";
      message.error(msg);
      throw error; // Ném lỗi để AuthForm hiển thị viền đỏ (nếu có logic đó)
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
        // Input type password cho mã PIN là đúng
        { name: "pin", label: "Mã PIN", type: "password", placeholder: "••••" },
      ]}
      onSubmit={handleSubmit}
      // 4. Truyền prop loading xuống để disable nút khi đang gọi API
      // (Lưu ý: AuthForm của bạn cần nhận prop này, nếu chưa có thì thêm vào interface AuthFormProps)
      // isLoading={loading} 
    />
  );
}