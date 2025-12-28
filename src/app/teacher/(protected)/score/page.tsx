"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { teacherService } from "@/services/teacher/teacher.service";
import { useQuery } from "@tanstack/react-query";
import { Select, Spin, Tag, Empty } from "antd";
import { Edit, CheckCircle, Clock } from "lucide-react";
import { StudentInClass } from "@/types/teacher.types";

export default function TeacherScoreIndexPage() {
  const router = useRouter();
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>();
  const [selectedTerm, setSelectedTerm] = useState<string>("HK1");

  const { data: classes, isLoading: loadingClasses } = useQuery({
    queryKey: ["teacher-classes"],
    queryFn: teacherService.getMyClasses,
  });

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ["class-students", selectedClassId, selectedTerm],
    queryFn: () => teacherService.getClassStudents(selectedClassId!, selectedTerm),
    enabled: !!selectedClassId,
  });

  const columns = [
    {
      key: "studentCode",
      title: "Mã HS",
      render: (row: StudentInClass) => <span className="font-mono text-gray-600">{row.studentCode}</span>
    },
    {
      key: "fullName",
      title: "Họ và tên",
      render: (row: StudentInClass) => <span className="font-medium text-[#000000]">{row.fullName}</span>
    },
    {
      key: "status",
      title: "Trạng thái điểm",
      render: (row: StudentInClass) => {
        if (row.reportStatus === 'Đã công bố')
          return <Tag color="green">Đã công bố</Tag>;
        if (row.reportStatus === 'Lưu nháp')
          return <Tag color="orange">Lưu nháp</Tag>;
        return <Tag color="default">Chưa nhập</Tag>;
      }
    },
    {
      key: "actions",
      title: "Thao tác",
      render: (row: StudentInClass) => {
        const isEdit =
          row.reportStatus === "Đã công bố" ||
          row.reportStatus === "Lưu nháp";

        return (
          <Button
            size="sm"
            variant="outline"
            className="gap-2 w-[120px]"
            onClick={() =>
              router.push(`/teacher/score/${row.id}?classId=${selectedClassId}&term=${selectedTerm}`)
            }
          >
            <Edit size={14} /> {isEdit ? "Sửa điểm" : "Nhập điểm"}
          </Button>
        );
      },
    }
  ];

  if (loadingClasses) return <div className="flex justify-center p-20"><Spin size="large" /></div>;

  return (
    <PageContainer title="Quản lý điểm số" subtitle="Chọn lớp và học sinh để cập nhật bảng điểm">

      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-end sm:items-center">
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

      {!selectedClassId ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 mb-2">Vui lòng chọn lớp học để xem danh sách.</p>
        </div>
      ) : loadingStudents ? (
        <div className="flex justify-center p-10"><Spin size="large" /></div>
      ) : (
        <Table
          columns={columns}
          data={students || []}
          emptyText="Lớp này chưa có học sinh nào."
        />
      )}
    </PageContainer>
  );
}