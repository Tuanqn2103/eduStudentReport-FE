"use client";

import { useState, useRef } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { teacherService } from "@/services/teacher/teacher.service";
import { useQuery } from "@tanstack/react-query";
import { Select, Spin, Empty } from "antd";
import { PDFExportButton } from "@/components/ui/PDFExportButton";
import { StudentReport } from "@/types/teacher.types";

export default function TeacherReportsPage() {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<string>("HK1");

  const componentRef = useRef<HTMLElement | null>(null);

  const { data: classes } = useQuery({
    queryKey: ["teacher-classes"],
    queryFn: teacherService.getMyClasses,
  });

  const { data: reports, isLoading } = useQuery({
    queryKey: ["class-reports", selectedClassId, selectedTerm],
    queryFn: () => teacherService.getClassReports(selectedClassId!, selectedTerm),
    enabled: !!selectedClassId,
  });

  return (
    <PageContainer title="Xuất báo cáo PDF" subtitle="Xem và in bảng điểm tổng hợp">
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-full sm:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Chọn lớp học</label>
            <Select
              className="w-full"
              placeholder="Chọn lớp..."
              options={classes?.map(c => ({ label: `${c.className} (${c.schoolYear})`, value: c.id }))}
              onChange={setSelectedClassId}
              value={selectedClassId}
            />
          </div>

          <div className="w-full sm:w-40">
            <label className="block text-sm font-medium text-gray-700 mb-1">Kỳ học</label>
            <Select
              className="w-full"
              value={selectedTerm}
              onChange={setSelectedTerm}
              options={[
                { label: "Học kỳ 1", value: "HK1" },
                { label: "Học kỳ 2", value: "HK2" },
              ]}
            />
          </div>

          <div className="pb-1">
             {reports && reports.length > 0 && (
                <PDFExportButton 
                  contentRef={componentRef} 
                  filename={`BangDiem_${selectedClassId}_${selectedTerm}`} 
                />
             )}
          </div>
        </div>
      </Card>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 min-h-[400px]">
        {!selectedClassId ? (
          <div className="flex h-60 items-center justify-center text-gray-500">
            Vui lòng chọn lớp để xem báo cáo.
          </div>
        ) : isLoading ? (
          <div className="flex h-60 items-center justify-center"><Spin size="large" /></div>
        ) : !reports || reports.length === 0 ? (
          <Empty description="Chưa có dữ liệu điểm số cho lớp này" />
        ) : (
          <div
            ref={(el) => { componentRef.current = el; }}
            className="bg-white p-8 shadow-sm max-w-4xl mx-auto print:shadow-none"
          >
            <div className="text-center mb-8 border-b pb-4">
              <h1 className="text-2xl font-bold uppercase mb-2">Bảng Tổng Hợp Kết Quả Học Tập</h1>
              <p className="text-gray-600">Lớp: <span className="font-bold">{classes?.find(c => c.id === selectedClassId)?.className}</span> - Kỳ: {selectedTerm}</p>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left w-10">STT</th>
                  <th className="border border-gray-300 p-2 text-left">Họ và tên</th>
                  <th className="border border-gray-300 p-2 text-left">Mã HS</th>
                  {reports[0].grades.map((g, idx) => (
                    <th key={idx} className="border border-gray-300 p-2 text-center">{g.subject}</th>
                  ))}
                  <th className="border border-gray-300 p-2 text-left">Nhận xét chung</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={report.id}>
                    <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                    <td className="border border-gray-300 p-2 font-medium">{report.student?.fullName}</td>
                    <td className="border border-gray-300 p-2 font-mono">{report.student?.studentCode}</td>
                    {report.grades.map((g, idx) => (
                      <td key={idx} className="border border-gray-300 p-2 text-center font-bold">
                        {g.score}
                      </td>
                    ))}
                    <td className="border border-gray-300 p-2 italic text-gray-600">
                      {report.generalComment || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-10 mr-10">
              <div className="text-center">
                <p className="italic mb-4">Ngày ... tháng ... năm ...</p>
                <p className="font-bold">Giáo viên chủ nhiệm</p>
                <p className="mt-16">(Ký và ghi rõ họ tên)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}