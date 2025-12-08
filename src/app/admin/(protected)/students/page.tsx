"use client";

import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { adminService } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";

export default function AdminStudentsPage() {
  const { data } = useQuery({
    queryKey: ["admin-students"],
    queryFn: adminService.getStudents,
  });

  const rows =
    data?.students ?? [
      { name: "Phạm Minh Châu", className: "5A1", parent: "Trần Thị Hương" },
      { name: "Đỗ Gia Bảo", className: "5A2", parent: "Đỗ Thu Trang" },
    ];

  return (
    <PageContainer title="Quản lý học sinh" subtitle="Danh sách và thông tin phụ huynh">
      <div className="mb-4 flex justify-between gap-3">
        <Button variant="outline">Import Excel</Button>
        <Button>Thêm học sinh</Button>
      </div>
      <Table
        columns={[
          { key: "name", title: "Tên học sinh" },
          { key: "className", title: "Lớp" },
          { key: "parent", title: "Phụ huynh" },
        ]}
        data={rows}
      />
    </PageContainer>
  );
}

