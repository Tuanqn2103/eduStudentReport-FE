"use client";

import { useRef } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { PDFExportButton } from "@/components/ui/PDFExportButton";
import { Table } from "@/components/ui/Table";
import { teacherService } from "@/services/teacher.service";
import { useQuery } from "@tanstack/react-query";

export default function TeacherReportsPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { data } = useQuery({
    queryKey: ["teacher-reports"],
    queryFn: teacherService.getReports,
  });

  const reports =
    data?.reports ?? [
      { className: "5A1", week: "Tuần 12", status: "Đã gửi" },
      { className: "5A2", week: "Tuần 12", status: "Chưa gửi" },
    ];

  return (
    <PageContainer title="Xuất báo cáo PDF" subtitle="Tải nhanh báo cáo lớp phụ trách">
      <div className="mb-4 flex justify-end">
        <PDFExportButton contentRef={contentRef} filename="teacher-reports" />
      </div>

      <div ref={contentRef}>
        <Table
          columns={[
            { key: "className", title: "Lớp" },
            { key: "week", title: "Kỳ" },
            { key: "status", title: "Trạng thái" },
          ]}
          data={reports}
        />
      </div>
    </PageContainer>
  );
}

