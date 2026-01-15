"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Teacher } from "@/types/admin.types";
import { Eye, EyeOff } from "lucide-react";

interface TeacherFormProps {
  initialData?: Teacher;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function TeacherForm({ initialData, onSubmit, isLoading }: TeacherFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    phoneNumber: initialData?.phoneNumber || "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              label="Họ và tên"
              placeholder="Ví dụ: Nguyễn Văn A"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>
          <Input
            label="Số điện thoại"
            placeholder="09xx xxx xxx"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            required
          />
          <div className="relative">
            <Input
              label={initialData ? "Mật khẩu mới (Để trống nếu không đổi)" : "Mật khẩu khởi tạo"}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!initialData}
              className="pr-10" 
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none p-1"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="cursor-pointer"
            disabled={isLoading}
          >
            Hủy bỏ
          </Button>
          <Button type="submit" className="cursor-pointer" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : initialData ? "Cập nhật" : "Thêm giáo viên"}
          </Button>
        </div>
      </form>
    </Card>
  );
}