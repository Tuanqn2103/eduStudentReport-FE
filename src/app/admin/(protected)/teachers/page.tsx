"use client";

import { useMemo } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { adminService } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";

export default function AdminTeachersPage() {
  const { data } = useQuery({
    queryKey: ["admin-teachers"],
    queryFn: async () => adminService.getTeachers(),
  });

  const rows = (data as any)?.teachers ?? [
    { name: "Nguyễn Văn A", phoneNumber: "0901 234 567", subject: "Toán" },
    { name: "Trần Thị B", phoneNumber: "0902 345 678", subject: "Văn" },
    { name: "Lê Văn C", phoneNumber: "0903 456 789", subject: "Anh" },
  ];

  const columns = useMemo(
    () => [
      { key: "name", title: "Tên" },
      { key: "phoneNumber", title: "SĐT" },
      { key: "subject", title: "Bộ môn" },
      {
        key: "actions",
        title: "Thao tác",
        render: () => (
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Sửa
            </Button>
            <Button size="sm" variant="ghost" className="text-red-600">
              Xóa
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <PageContainer title="Quản lý giáo viên" subtitle="Thêm/Sửa/Xóa giáo viên">
      <div className="mb-4 flex flex-col sm:flex-row justify-end gap-2">
        <Button className="w-full sm:w-auto">Thêm giáo viên</Button>
      </div>
      <Table columns={columns as any} data={rows} />
    </PageContainer>
  );
}

