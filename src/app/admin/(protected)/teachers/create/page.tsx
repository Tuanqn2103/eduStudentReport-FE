"use client";

import PageContainer from "@/components/layout/PageContainer";
import TeacherForm from "@/components/features/admin/TeacherForm";
import { teacherService } from "@/services/admin/teacher.service";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateTeacherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: any) => {
    try {
      setLoading(true);
      await teacherService.create(data);
      message.success("Tạo giáo viên thành công!");
      router.push("/admin/teachers");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Lỗi khi tạo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Thêm giáo viên mới"
      subtitle="Tạo tài khoản và thông tin cho giáo viên"
    >
      <TeacherForm onSubmit={handleCreate} isLoading={loading} />
    </PageContainer>
  );
}