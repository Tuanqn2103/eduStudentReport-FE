"use client";

import { use } from "react";
import PageContainer from "@/components/layout/PageContainer";
import ClassForm from "@/components/features/admin/ClassForm";
import { classService } from "@/services/admin/class.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { message, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClassItem } from "@/types/admin.types";

export default function EditClassPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = use(params);
  const [saving, setSaving] = useState(false);

  const { data: classData, isLoading } = useQuery<ClassItem>({
    queryKey: ["class", id],
    queryFn: () => classService.getById(id),
  });

  const handleUpdate = async (data: {
    className: string;
    schoolYear: string;
    teacherId?: string;
  }) => {
    try {
      setSaving(true);

      await classService.update(id, {
        className: data.className,
        schoolYear: data.schoolYear,
        teacherId: data.teacherId,
      });

      message.success("Cập nhật thành công!");
      await queryClient.invalidateQueries({ queryKey: ["admin-classes"] });
      router.push("/admin/classes");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err?.response?.data?.message || "Lỗi cập nhật");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <PageContainer
      title="Chỉnh sửa lớp học"
      subtitle={`Cập nhật thông tin lớp: ${classData?.className}`}
    >
      {classData && (
        <ClassForm
          initialData={classData}
          onSubmit={handleUpdate}
          isLoading={saving}
        />
      )}
    </PageContainer>
  );
}
