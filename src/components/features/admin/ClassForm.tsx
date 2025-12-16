"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { teacherService } from "@/services/admin/teacher.service";
import { useQuery } from "@tanstack/react-query";
import { Select, Spin } from "antd";
import { ClassItem } from "@/types/admin.types";

interface ClassFormProps {
  initialData?: ClassItem;
  onSubmit: (data: {
    className: string;
    schoolYear: string;
    teacherId?: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function ClassForm({
  initialData,
  onSubmit,
  isLoading,
}: ClassFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<{
    className: string;
    schoolYear: string;
    teacherId?: string;
  }>({
    className: "",
    schoolYear: "",
    teacherId: undefined,
  });

  useEffect(() => {
    if (!initialData) return;

    setFormData({
      className: initialData.className,
      schoolYear: initialData.schoolYear,
      teacherId: initialData.teacherIds?.[0],
    });
  }, [initialData]);

  const { data: teachers, isLoading: loadingTeachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => teacherService.getAll(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label="Tên lớp"
            placeholder="Ví dụ: 1A, 2B..."
            value={formData.className}
            onChange={(e) =>
              setFormData({ ...formData, className: e.target.value })
            }
            required
          />

          <Input
            label="Niên khóa"
            placeholder="Ví dụ: 2025-2026"
            value={formData.schoolYear}
            onChange={(e) =>
              setFormData({ ...formData, schoolYear: e.target.value })
            }
            required
          />

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Giáo viên chủ nhiệm (Không bắt buộc)
            </label>

            {loadingTeachers ? (
              <Spin size="small" />
            ) : (
              <Select
                showSearch
                allowClear
                placeholder="Chọn giáo viên..."
                optionFilterProp="label"
                className="w-full h-10"
                size="large"
                value={formData.teacherId}
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    teacherId: val ?? undefined,
                  })
                }
                options={teachers?.map((t) => ({
                  label: `${t.fullName} - ${t.phoneNumber}`,
                  value: t.id,
                }))}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Hủy bỏ
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Cập nhật"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
