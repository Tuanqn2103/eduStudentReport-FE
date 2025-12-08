"use client";

import { useRouter } from "next/navigation";
import AuthForm from "@/components/shared/AuthForm";
import { authService } from "@/services/auth.service";

export default function TeacherLoginPage() {
  const router = useRouter();

  const handleSubmit = async (values: Record<string, string>) => {
    const res: any = await authService.login("teacher", values);
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", res.token);
      localStorage.setItem("role", "teacher");
    }
    router.push("/teacher/dashboard");
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

