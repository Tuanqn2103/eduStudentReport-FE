"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { Table, Column } from "@/components/ui/Table";
import { teacherService } from "@/services/teacher/teacher.service";
import { useQuery } from "@tanstack/react-query";
import { Select, Spin } from "antd";
import { Edit, FileSpreadsheet } from "lucide-react";
import { PDFExportButton } from "@/components/ui/PDFExportButton";

type ReportRow = {
  id: string;
  studentId: string;
  studentCode: string;
  fullName: string;
  generalComment: string;
  [key: string]: string | number | undefined;
};

export default function ClassReportsPage() {
  const router = useRouter();
  const componentRef = useRef<HTMLDivElement>(null);

  const [selectedClassId, setSelectedClassId] = useState<string | undefined>();
  const [selectedTerm, setSelectedTerm] = useState<string>("HK1");

  const { data: classes, isLoading: loadingClasses } = useQuery({
    queryKey: ["teacher-classes"],
    queryFn: teacherService.getMyClasses,
  });

  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: teacherService.getSubjects
  });

  const { data: reports, isLoading: loadingReports } = useQuery({
    queryKey: ["class-reports-grid", selectedClassId, selectedTerm],
    queryFn: () => teacherService.getClassReports(selectedClassId!, selectedTerm),
    enabled: !!selectedClassId,
  });

  const currentClass = classes?.find(c => c.id === selectedClassId);
  const today = new Date();
  const dateString = `Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  const tableData: ReportRow[] = useMemo(() => {
    if (!reports || !subjects) return [];

    return reports.map((report) => {
      const row: ReportRow = {
        id: report.id || report.studentId,
        studentId: report.studentId,
        studentCode: report.student?.studentCode || "N/A",
        fullName: report.student?.fullName || "Unknown",
        generalComment: report.generalComment || "",
      };

      subjects.forEach((sub) => {
        const grade = report.grades.find((g) => g.subject === sub.name);
        row[sub.code] = grade ? grade.score : "-";
      });

      return row;
    });
  }, [reports, subjects]);

  const columns: Column<ReportRow>[] = useMemo(() => {
    if (!subjects) return [];

    const baseColumns: Column<ReportRow>[] = [
      {
        key: "studentCode",
        title: "Mã HS",
        width: "100px",
        render: (row) => <span className="font-mono text-gray-600">{row.studentCode}</span>
      },
      {
        key: "fullName",
        title: "Họ và tên",
        width: "220px",
        render: (row) => (
          <div 
            className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
            onClick={() =>
              router.push(
                `/teacher/score/${row.studentId}?classId=${selectedClassId}&term=${selectedTerm}`
              )
            }
            title="Nhấn để chỉnh sửa điểm"
          >
            <span className="font-medium border-b border-transparent group-hover:border-blue-700">
              {row.fullName}
            </span>
          </div>
        )
      },
    ];

    const subjectColumns: Column<ReportRow>[] = subjects.map((sub) => ({
      key: sub.code,
      title: sub.name,
      align: "center",
      width: "80px",
      render: (row) => {
        const score = row[sub.code];
        let colorClass = "text-gray-700";
        if (typeof score === 'number') {
          if (score >= 8) colorClass = "text-green-600 font-bold";
          else if (score < 5) colorClass = "text-red-600 font-bold";
        }
        return <span className={colorClass}>{score}</span>;
      }
    }));

    const commentColumn: Column<ReportRow> = {
      key: "generalComment",
      title: "Nhận xét chung",
      width: "200px",
      render: (row) => <span className="text-sm text-gray-600 italic">{row.generalComment || "-"}</span>
    };

    return [...baseColumns, ...subjectColumns, commentColumn];
  }, [subjects, selectedClassId, selectedTerm, router]);

  if (loadingClasses || loadingSubjects) return <div className="flex justify-center p-20"><Spin size="large" /></div>;

  return (
    <PageContainer
      title="Bảng điểm tổng hợp"
      subtitle="Xem và in bảng điểm của cả lớp"
    >
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Select
              className="w-full"
              placeholder="Chọn lớp..."
              size="large"
              onChange={setSelectedClassId}
              value={selectedClassId}
              options={classes?.map(c => ({ label: `${c.className} (${c.schoolYear})`, value: c.id }))}
            />
          </div>

          <div className="w-full sm:w-40">
            <Select
              className="w-full"
              size="large"
              value={selectedTerm}
              onChange={setSelectedTerm}
              options={[
                { value: 'HK1', label: 'Học kỳ 1' },
                { value: 'HK2', label: 'Học kỳ 2' },
              ]}
            />
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <PDFExportButton
            contentRef={componentRef}
            filename={`BangDiem_${currentClass?.className}_${selectedTerm}`}
          />
        </div>
      </div>

      <div ref={componentRef} className="bg-white rounded-lg p-4 print:p-8">

        <div className="hidden print:block text-center mb-6">
          <h1 className="text-2xl font-bold uppercase">Bảng Tổng Hợp Kết Quả Học Tập</h1>
          <div className="mt-2 text-sm text-gray-600">
            <p>Lớp: <span className="font-bold">{currentClass?.className}</span> - Niên khóa: {currentClass?.schoolYear}</p>
            <p>Kỳ học: {selectedTerm === 'HK1' ? 'Học kỳ 1' : 'Học kỳ 2'}</p>
          </div>
          <br />
        </div>

        {!selectedClassId ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 print:hidden">
            <FileSpreadsheet size={48} className="mb-4 opacity-50" />
            <p>Vui lòng chọn lớp học để xem bảng điểm.</p>
          </div>
        ) : loadingReports ? (
          <div className="flex justify-center p-10"><Spin size="large" /></div>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden print:border-black">
            <div className="overflow-x-auto">
              <Table
                columns={columns}
                data={tableData}
                emptyText="Chưa có dữ liệu điểm số."
              />
            </div>
          </div>
        )}
        <div className="hidden print:flex justify-end mt-8 mr-10">
          <div className="text-center">
            <p className="italic">{dateString}</p>
            <p className="font-bold mt-1 text-lg">Giáo viên chủ nhiệm</p>
            <div className="h-32"></div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}