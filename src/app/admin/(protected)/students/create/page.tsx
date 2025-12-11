"use client";

import PageContainer from "@/components/layout/PageContainer";
import StudentForm from "@/components/features/admin/StudentForm";
import { studentService } from "@/services/admin/student.service";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: any) => {
    try {
      setLoading(true);
      const res = await studentService.create(data);
      message.success(`Tạo thành công! Mã PIN: ${(res.data as any).pin}`); 
      router.push("/admin/students");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err?.response?.data?.message || "Lỗi khi tạo học sinh");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Thêm học sinh mới" subtitle="Tạo hồ sơ học sinh và cấp mã PIN">
      <StudentForm onSubmit={handleCreate} isLoading={loading} />
    </PageContainer>
  );
}