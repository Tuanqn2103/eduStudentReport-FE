"use client";

import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";

const classes = [
  { id: "5A1", students: 32, pendingReports: 4 },
  { id: "5A2", students: 31, pendingReports: 2 },
];

export default function TeacherClassesPage() {
  return (
    <PageContainer title="Lớp phụ trách" subtitle="Chọn lớp để xem danh sách học sinh">
      <Table
        columns={[
          { key: "id", title: "Lớp" },
          { key: "students", title: "Sĩ số" },
          { key: "pendingReports", title: "Báo cáo cần gửi" },
          {
            key: "actions",
            title: "Thao tác",
            render: (row: any) => (
              <Button size="sm" variant="outline" href={`/teacher/class/${row.id}`} asChild>
                Xem chi tiết
              </Button>
            ),
          },
        ]}
        data={classes}
      />
    </PageContainer>
  );
}

