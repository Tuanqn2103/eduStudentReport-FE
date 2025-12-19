"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { Table, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { teacherService } from "@/services/teacher/teacher.service";
import { useQuery } from "@tanstack/react-query";
import { Select, Spin, Empty, Tag } from "antd";
import { Edit, FileSpreadsheet } from "lucide-react";
import { StudentReport, Grade } from "@/types/teacher.types";

type ReportRow = {
  id: string;
  studentId: string;
  studentCode: string;
  fullName: string;
  [key: string]: string | number | undefined;
};

export default function ClassReportsPage() {
  const router = useRouter();
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
    enabled: !!selectedClassId, // Chỉ chạy khi đã chọn lớp
  });

  const tableData: ReportRow[] = useMemo(() => {
    if (!reports || !subjects) return [];

    return reports.map((report) => {
      const row: ReportRow = {
        id: report.id || report.studentId,
        studentId: report.studentId,
        studentCode: report.student?.studentCode || "N/A",
        fullName: report.student?.fullName || "Unknown",
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
        width: "100",
        render: (row) => <span className="font-mono text-gray-600">{row.studentCode}</span>
      },
      {
        key: "fullName",
        title: "Họ và tên",
        width: "200",
        render: (row) => <span className="font-medium text-slate-900">{row.fullName}</span>
      },
    ];
    const subjectColumns: Column<ReportRow>[] = subjects.map((sub) => ({
      key: sub.code,
      title: sub.name,
      align: "center",
      width: "100",
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

    const actionColumn: Column<ReportRow> = {
      key: "actions",
      title: "Thao tác",
      align: "center",
      width: "100",
      render: (row) => (
        <Button
          size="sm"
          variant="ghost"
          className="hover:text-blue-600"
          onClick={() => router.push(`/teacher/score/${row.studentId}?classId=${selectedClassId}&term=${selectedTerm}`)}
        >
          <Edit size={16} />
        </Button>
      )
    };

    return [...baseColumns, ...subjectColumns, actionColumn];
  }, [subjects, selectedClassId, selectedTerm, router]);

  if (loadingClasses || loadingSubjects) return <div className="flex justify-center p-20"><Spin size="large" /></div>;

  return (
    <PageContainer
      title="Bảng điểm tổng hợp"
      subtitle="Xem điểm tất cả các môn của cả lớp"
    >
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Lớp chủ nhiệm</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Kỳ học</label>
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
      </div>

      {!selectedClassId ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
          <FileSpreadsheet size={48} className="mb-4 opacity-50" />
          <p>Vui lòng chọn lớp học để xem bảng điểm.</p>
        </div>
      ) : loadingReports ? (
        <div className="flex justify-center p-10"><Spin size="large" /></div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              data={tableData}
              emptyText="Chưa có dữ liệu điểm số."
            />
          </div>
        </div>
      )}
    </PageContainer>
  );
}