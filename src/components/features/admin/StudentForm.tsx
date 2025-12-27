"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { classService } from "@/services/admin/class.service";
import { useQuery } from "@tanstack/react-query";
import { Select, DatePicker, Radio, Spin } from "antd";
import dayjs from "dayjs";
import { Student } from "@/types/admin.types";

interface StudentFormProps {
  initialData?: Student;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function StudentForm({ initialData, onSubmit, isLoading }: StudentFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    gender: initialData?.gender || "Nam",
    dateOfBirth: initialData?.dateOfBirth ? dayjs(initialData.dateOfBirth) : null,
    parentPhones: initialData?.parentPhones?.join(", ") || "",
    classId: initialData?.classId || undefined,
  });

  const { data: classes, isLoading: loadingClasses } = useQuery({
    queryKey: ['classes'],
    queryFn: () => classService.getAll()
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      parentPhones: formData.parentPhones.split(",").map(p => p.trim()).filter(p => p),
      dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : null,
    };

    await onSubmit(payload);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          <div className="md:col-span-2">
            <Input
              label="Họ và tên học sinh"
              placeholder="Ví dụ: Nguyễn Văn A"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="md:col-span-1">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Lớp học <span className="text-red-500">*</span>
            </label>
            {loadingClasses ? <Spin size="small" /> : (
              <Select
                showSearch
                placeholder="Chọn lớp..."
                optionFilterProp="label"
                className="w-full h-10"
                size="large"
                value={formData.classId}
                onChange={(val) => setFormData({ ...formData, classId: val })}
                options={classes?.map((c) => ({
                  label: `${c.className} (${c.schoolYear})`,
                  value: c.id
                }))}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            )}
          </div>

          <div className="md:col-span-1 flex flex-col">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Ngày sinh
            </label>
            <DatePicker 
              className="w-full h-10 cursor-pointer"
              format="DD/MM/YYYY"
              value={formData.dateOfBirth}
              onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
              placeholder="Chọn ngày sinh"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Giới tính</label>
            <Radio.Group 
              value={formData.gender} 
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <Radio value="Nam">Nam</Radio>
              <Radio value="Nữ">Nữ</Radio>
            </Radio.Group>
          </div>

          <div className="md:col-span-2">
            <Input
              label="Số điện thoại phụ huynh (ngăn cách bằng dấu phẩy)"
              placeholder="Ví dụ: 0912xxx, 0988xxx"
              value={formData.parentPhones}
              onChange={(e) => setFormData({ ...formData, parentPhones: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">
              * Hệ thống sẽ dùng SĐT này để phụ huynh đăng nhập.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            className="cursor-pointer"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Hủy bỏ
          </Button>
          <Button type="submit" className="cursor-pointer" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : initialData ? "Cập nhật" : "Thêm học sinh"}
          </Button>
        </div>
      </form>
    </Card>
  );
}