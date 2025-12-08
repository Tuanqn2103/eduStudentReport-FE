"use client";

import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";

const students = [
  { id: "STU001", name: "Phạm Minh Châu", className: "5A1" },
  { id: "STU002", name: "Đỗ Gia Bảo", className: "5A2" },
];

export default function TeacherScoreIndexPage() {
  return (
    <PageContainer title="Nhập điểm" subtitle="Chọn học sinh để cập nhật bảng điểm">
      <Table
        columns={[
          { key: "id", title: "Mã HS" },
          { key: "name", title: "Tên" },
          { key: "className", title: "Lớp" },
          {
            key: "actions",
            title: "Thao tác",
            render: (row: any) => (
              <Button size="sm" href={`/teacher/score/${row.id}`} variant="outline" asChild>
                Nhập điểm
              </Button>
            ),
          },
        ]}
        data={students}
      />
    </PageContainer>
  );
}

