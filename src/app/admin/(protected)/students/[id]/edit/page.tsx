"use client";

import { use } from "react";
import PageContainer from "@/components/layout/PageContainer";
import StudentForm from "@/components/features/admin/StudentForm";
import { studentService } from "@/services/admin/student.service";
import { useQuery } from "@tanstack/react-query";
import { message, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [saving, setSaving] = useState(false);

  const { data: student, isLoading } = useQuery({
    queryKey: ["student", id],
    queryFn: () => studentService.getById(id),
  });

  const handleUpdate = async (data: any) => {
    try {
      setSaving(true);
      await studentService.update(id, data);
      message.success("Cập nhật hồ sơ thành công!");
      router.push("/admin/students");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err?.response?.data?.message || "Lỗi cập nhật");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Spin size="large" /></div>;

  return (
    <PageContainer title="Chỉnh sửa hồ sơ" subtitle={`Cập nhật thông tin: ${student?.fullName}`}>
      {student && <StudentForm initialData={student} onSubmit={handleUpdate} isLoading={saving} />}
    </PageContainer>
  );
}