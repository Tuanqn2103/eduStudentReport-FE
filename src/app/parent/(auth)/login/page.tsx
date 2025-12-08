"use client";

import { useRouter } from "next/navigation";
import AuthForm from "@/components/shared/AuthForm";
import { authService } from "@/services/auth.service";

export default function ParentLoginPage() {
  const router = useRouter();

  const handleSubmit = async (values: Record<string, string>) => {
    const res: any = await authService.login("parent", values);
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", res.token);
      localStorage.setItem("role", "parent");
    }
    router.push("/parent/scores");
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

