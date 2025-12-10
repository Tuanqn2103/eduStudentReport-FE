"use client";
import { use } from "react";
import PageContainer from "@/components/layout/PageContainer";
import TeacherForm from "@/components/features/admin/TeacherForm";
import { teacherService } from "@/services/admin/teacher.service";
import { useQuery } from "@tanstack/react-query";
import { message, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditTeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  const { id } = use(params);

  const { data: teacher, isLoading } = useQuery({
    queryKey: ["teacher", id],
    queryFn: () => teacherService.getById(id),
  });

  const handleUpdate = async (data: any) => {
    try {
      setSaving(true);
      const payload = { ...data };
      if (!payload.password) delete payload.password;

      await teacherService.update(id, payload);
      message.success("Cập nhật thành công!");
      router.push("/admin/teachers");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Lỗi khi cập nhật");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Spin /></div>;

  return (
    <PageContainer
      title="Chỉnh sửa giáo viên"
      subtitle={`Cập nhật thông tin cho: ${teacher?.fullName}`}
    >
      {teacher && (
        <TeacherForm
          initialData={teacher}
          onSubmit={handleUpdate}
          isLoading={saving}
        />
      )}
    </PageContainer>
  );
}