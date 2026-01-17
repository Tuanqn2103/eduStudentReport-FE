"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Table, Column } from "@/components/ui/Table";
import { teacherService } from "@/services/teacher/teacher.service";
import { useQuery } from "@tanstack/react-query";
import { Select, Tag, Spin, Input, Dropdown, MenuProps } from "antd";
import { Edit, Search, Filter, X } from "lucide-react";
import { StudentInClass } from "@/types/teacher.types";

type FilterType = 'ALL' | 'PUBLISHED' | 'DRAFT' | 'MISSING';

export default function TeacherScoreIndexPage() {
  const router = useRouter();
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>();
  const [selectedTerm, setSelectedTerm] = useState<string>("HK1");

  const [filters, setFilters] = useState({
    studentCode: "",
    fullName: "",
    status: "ALL" as FilterType
  });

  const { data: classes, isLoading: loadingClasses } = useQuery({
    queryKey: ["teacher-classes"],
    queryFn: teacherService.getMyClasses,
  });

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ["class-students", selectedClassId, selectedTerm],
    queryFn: () => teacherService.getClassStudents(selectedClassId!, selectedTerm),
    enabled: !!selectedClassId,
  });

  const filteredStudents = useMemo(() => {
    if (!students) return [];

    return students.filter((student) => {
      const matchCode = student.studentCode.toLowerCase().includes(filters.studentCode.toLowerCase());
      const matchName = student.fullName.toLowerCase().includes(filters.fullName.toLowerCase());

      let matchStatus = true;
      if (filters.status === 'PUBLISHED') matchStatus = student.reportStatus === 'Đã công bố';
      else if (filters.status === 'DRAFT') matchStatus = student.reportStatus === 'Lưu nháp';
      else if (filters.status === 'MISSING') matchStatus = !student.reportStatus || student.reportStatus === 'Chưa nhập';

      return matchCode && matchName && matchStatus;
    });
  }, [students, filters]);

  const getFilterIconColor = (isActive: boolean) => isActive ? "text-blue-600 fill-blue-100" : "text-gray-400";
  const columns = useMemo<Column<StudentInClass>[]>(() => [
    {
      key: "studentCode",
      width: "150px",
      title: (
        <div className="flex items-center gap-2">
          Mã HS
          <Dropdown
            trigger={['click']}
            popupRender={() => (
              <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100 w-60">
                <Input
                  placeholder="Tìm mã HS..."
                  value={filters.studentCode}
                  onChange={(e) => setFilters(prev => ({ ...prev, studentCode: e.target.value }))}
                  prefix={<Search size={14} className="text-gray-400" />}
                  allowClear
                  autoFocus
                />
              </div>
            )}
          >
            <Search size={14} className={`cursor-pointer hover:text-blue-500 ${filters.studentCode ? "text-blue-600" : "text-gray-400"}`} />
          </Dropdown>
        </div>
      ) as any,
      render: (row) => <span className="font-mono text-gray-600">{row.studentCode}</span>
    },
    {
      key: "fullName",
      width: "250px",
      title: (
        <div className="flex items-center gap-2">
          Họ và tên
          <Dropdown
            trigger={['click']}
            popupRender={() => (
              <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100 w-64">
                <Input
                  placeholder="Tìm họ tên..."
                  value={filters.fullName}
                  onChange={(e) => setFilters(prev => ({ ...prev, fullName: e.target.value }))}
                  prefix={<Search size={14} className="text-gray-400" />}
                  allowClear
                  autoFocus
                />
              </div>
            )}
          >
            <Search size={14} className={`cursor-pointer hover:text-blue-500 ${filters.fullName ? "text-blue-600" : "text-gray-400"}`} />
          </Dropdown>
        </div>
      ) as any,
      render: (row) => <span className="font-medium text-[#000000]">{row.fullName}</span>
    },
    {
      key: "status",
      width: "150px",
      title: (
        <div className="flex items-center gap-2">
          Trạng thái
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                { key: 'ALL', label: 'Tất cả' },
                { key: 'PUBLISHED', label: 'Đã công bố' },
                { key: 'DRAFT', label: 'Lưu nháp' },
                { key: 'MISSING', label: 'Chưa nhập' },
              ],
              onClick: (e) => setFilters(prev => ({ ...prev, status: e.key as any })),
              selectedKeys: [filters.status]
            }}
          >
            <Filter size={14} className={`cursor-pointer hover:text-blue-500 ${getFilterIconColor(filters.status !== 'ALL')}`} />
          </Dropdown>
        </div>
      ) as any,
      render: (row) => {
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
      width: "150px",
      align: "left",
      render: (row) => {
        const isEdit =
          row.reportStatus === "Đã công bố" ||
          row.reportStatus === "Lưu nháp";

        return (
          <Button
            size="sm"
            variant="outline"
            className="gap-2 w-full justify-center"
            onClick={() =>
              router.push(`/teacher/reports/${row.id}?classId=${selectedClassId}&term=${selectedTerm}`)
            }
          >
            <Edit size={14} /> {isEdit ? "Sửa điểm" : "Nhập điểm"}
          </Button>
        );
      },
    }
  ], [filters, router, selectedClassId, selectedTerm]);

  if (loadingClasses) return <div className="flex justify-center p-20"><Spin size="large" /></div>;

  return (
    <PageContainer title="Quản lý điểm số" subtitle="Chọn lớp và học sinh để cập nhật bảng điểm">
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="flex gap-4 w-full md:w-auto flex-wrap">
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
        {(filters.studentCode || filters.fullName || filters.status !== 'ALL') && (
          <Button
            variant="ghost"
            onClick={() =>
              setFilters({
                studentCode: "",
                fullName: "",
                status: "ALL",
              })
            }
            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-[40px] px-3.5 rounded-lg border border-red-100 transition-all flex items-center gap-1.5shadow-sm hover:shadow"
          >
            <X size={16} className="shrink-0" />
            <span className="text-sm font-medium">Xóa bộ lọc</span>
          </Button>
        )}
      </div>

      {!selectedClassId ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 mb-2">Vui lòng chọn lớp học để xem danh sách.</p>
        </div>
      ) : loadingStudents ? (
        <div className="flex justify-center p-10"><Spin size="large" /></div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            data={filteredStudents}
            emptyText="Không tìm thấy học sinh nào phù hợp."
          />
        </div>
      )}
    </PageContainer>
  );
}