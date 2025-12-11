"use client";

import PageContainer from "@/components/layout/PageContainer";
import ClassForm from "@/components/features/admin/ClassForm";
import { classService } from "@/services/admin/class.service";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateClassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: { className: string; schoolYear: string; teacherId?: string }) => {
    try {
      setLoading(true);
      await classService.create(data);
      message.success("Tạo lớp thành công!");
      router.push("/admin/classes");
    } catch (error: unknown) {
      // Type casting an toàn cho error
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err?.response?.data?.message || "Lỗi khi tạo lớp");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Thêm lớp học mới" subtitle="Tạo lớp và phân công giáo viên">
      <ClassForm onSubmit={handleCreate} isLoading={loading} />
    </PageContainer>
  );
}