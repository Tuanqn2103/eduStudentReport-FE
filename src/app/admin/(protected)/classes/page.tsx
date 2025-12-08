"use client";

import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { adminService } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";

export default function AdminClassesPage() {
  const { data } = useQuery({
    queryKey: ["admin-classes"],
    queryFn: adminService.getClasses,
  });

  const rows =
    data?.classes ?? [
      { name: "5A1", homeroomTeacher: "Nguyễn Văn A", students: 32 },
      { name: "5A2", homeroomTeacher: "Trần Thị B", students: 31 },
    ];

  return (
    <PageContainer title="Quản lý lớp học" subtitle="Tạo lớp và gán giáo viên chủ nhiệm">
      <div className="mb-4 flex justify-between gap-3">
        <Button>Tạo lớp</Button>
        <Button variant="outline">Phân công giáo viên</Button>
      </div>
      <Table
        columns={[
          { key: "name", title: "Tên lớp" },
          { key: "homeroomTeacher", title: "GVCN" },
          { key: "students", title: "Sĩ số" },
        ]}
        data={rows}
      />
    </PageContainer>
  );
}

