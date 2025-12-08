"use client";

import { useRouter } from "next/navigation";
import AuthForm from "@/components/shared/AuthForm";
import { authService } from "@/services/auth.service";

export default function AdminLoginPage() {
  const router = useRouter();

  const handleSubmit = async (values: Record<string, string>) => {
    const res: any = await authService.login("admin", values);
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", res.token);
      localStorage.setItem("role", "admin");
    }
    router.push("/admin/dashboard");
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
      onSubmit={handleSubmit}
    />
  );
}

