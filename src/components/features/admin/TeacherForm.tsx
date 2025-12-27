"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { CreateTeacherPayload, Teacher } from "@/types/admin.types";

interface TeacherFormProps {
  initialData?: Teacher;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function TeacherForm({ initialData, onSubmit, isLoading }: TeacherFormProps) {
  const router = useRouter();
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
          <Input
            label={initialData ? "Mật khẩu mới (Để trống nếu không đổi)" : "Mật khẩu khởi tạo"}
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!initialData}
          />
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
            {isLoading ? "Đang xử lý..." : initialData ? "Cập nhật" : "Tạo giáo viên"}
          </Button>
        </div>
      </form>
    </Card>
  );
}