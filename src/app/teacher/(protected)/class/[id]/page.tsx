"use client";

import { useMemo } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { teacherService } from "@/services/teacher.service";
import { useQuery } from "@tanstack/react-query";

export default function TeacherClassDetailPage({ params }: { params: { id: string } }) {
  const { data } = useQuery({
    queryKey: ["teacher-class", params.id],
    queryFn: () => teacherService.getClassStudents(params.id),
  });

  const students =
    data?.students ?? [
      { name: "Phạm Minh Châu", parent: "Trần Thị Hương", studentId: "STU001" },
      { name: "Đỗ Gia Bảo", parent: "Đỗ Thu Trang", studentId: "STU002" },
    ];

  const columns = useMemo(
    () => [
      { key: "studentId", title: "Mã HS" },
      { key: "name", title: "Tên học sinh" },
      { key: "parent", title: "Phụ huynh" },
      {
        key: "actions",
        title: "Thao tác",
        render: (row: any) => (
          <Button size="sm" variant="outline" href={`/teacher/score/${row.studentId}`} asChild>
            Nhập điểm
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <PageContainer title={`Lớp ${params.id}`} subtitle="Danh sách học sinh">
      <Table columns={columns as any} data={students} />
    </PageContainer>
  );
}

