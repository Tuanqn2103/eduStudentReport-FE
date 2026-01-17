"use client";

import { use, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { Table, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { teacherService } from "@/services/teacher/teacher.service";
import { useQuery } from "@tanstack/react-query";
import { Select, Tag, Spin, Input, Dropdown } from "antd";
import {
  Edit,
  ArrowLeft,
  UserCog,
  Search,
  Filter,
  X,
  Eye,
} from "lucide-react";
import { StudentInClass } from "@/types/teacher.types";

type FilterType = "ALL" | "PUBLISHED" | "DRAFT" | "MISSING";

export default function TeacherClassDetailPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const router = useRouter();
  const { classId } = use(params);
  const [term, setTerm] = useState("HK1");

  const [filters, setFilters] = useState({
    studentCode: "",
    fullName: "",
    status: "ALL" as FilterType,
  });

  const { data: students, isLoading } = useQuery({
    queryKey: ["class-students", classId, term],
    queryFn: () => teacherService.getClassStudents(classId, term),
  });

  const filteredStudents = useMemo(() => {
    if (!students) return [];

    return students.filter((student) => {
      const matchCode = student.studentCode
        .toLowerCase()
        .includes(filters.studentCode.toLowerCase());

      const matchName = student.fullName
        .toLowerCase()
        .includes(filters.fullName.toLowerCase());

      let matchStatus = true;
      if (filters.status === "PUBLISHED")
        matchStatus = student.reportStatus === "Đã công bố";
      else if (filters.status === "DRAFT")
        matchStatus = student.reportStatus === "Lưu nháp";
      else if (filters.status === "MISSING")
        matchStatus =
          !student.reportStatus || student.reportStatus === "Chưa nhập";

      return matchCode && matchName && matchStatus;
    });
  }, [students, filters]);

  const getFilterIconColor = useCallback(
    (isActive: boolean) =>
      isActive ? "text-blue-600 fill-blue-100" : "text-gray-400",
    []
  );

  const columns = useMemo<Column<StudentInClass>[]>(() => {
    return [
      {
        key: "studentCode",
        width: "150px",
        title: (
          <div className="flex items-center gap-2">
            Mã HS
            <Dropdown
              trigger={["click"]}
              popupRender={() => (
                <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100 w-60">
                  <Input
                    placeholder="Tìm mã HS..."
                    value={filters.studentCode}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        studentCode: e.target.value,
                      }))
                    }
                    prefix={<Search size={14} className="text-gray-400" />}
                    allowClear
                    autoFocus
                  />
                </div>
              )}
            >
              <Search
                size={14}
                className={`cursor-pointer hover:text-blue-500 ${filters.studentCode ? "text-blue-600" : "text-gray-400"
                  }`}
              />
            </Dropdown>
          </div>
        ),
        render: (row) => (
          <span className="font-mono text-gray-600 break-words">
            {row.studentCode}
          </span>
        ),
      },
      {
        key: "fullName",
        width: "250px",
        title: (
          <div className="flex items-center gap-2">
            Họ và tên
            <Dropdown
              trigger={["click"]}
              popupRender={() => (
                <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100 w-64">
                  <Input
                    placeholder="Tìm họ tên..."
                    value={filters.fullName}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    prefix={<Search size={14} className="text-gray-400" />}
                    allowClear
                    autoFocus
                  />
                </div>
              )}
            >
              <Search
                size={14}
                className={`cursor-pointer hover:text-blue-500 ${filters.fullName ? "text-blue-600" : "text-gray-400"
                  }`}
              />
            </Dropdown>
          </div>
        ),
        render: (row) => (
          <span className="font-medium text-black break-words">
            {row.fullName}
          </span>
        ),
      },
      {
        key: "reportStatus",
        width: "160px",
        title: (
          <div className="flex items-center gap-2">
            Trạng thái
            <Dropdown
              trigger={["click"]}
              menu={{
                items: [
                  { key: "ALL", label: "Tất cả" },
                  { key: "PUBLISHED", label: "Đã công bố" },
                  { key: "DRAFT", label: "Lưu nháp" },
                  { key: "MISSING", label: "Chưa nhập" },
                ],
                onClick: (e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.key as FilterType,
                  })),
                selectedKeys: [filters.status],
              }}
            >
              <Filter
                size={14}
                className={`cursor-pointer hover:text-blue-500 ${getFilterIconColor(
                  filters.status !== "ALL"
                )}`}
              />
            </Dropdown>
          </div>
        ),
        render: (row) => {
          if (row.reportStatus === "Đã công bố")
            return <Tag color="green">Đã công bố</Tag>;
          if (row.reportStatus === "Lưu nháp")
            return <Tag color="orange">Lưu nháp</Tag>;
          return <Tag color="default">Chưa nhập</Tag>;
        },
      },
      {
        key: "isParentViewed",
        width: "140px",
        title: "Phụ huynh",
        render: (row) =>
          row.isParentViewed ? (
            <Tag color="blue" icon={<Eye size={12} />}>
              Đã xem
            </Tag>
          ) : (
            <span className="text-gray-400 text-sm">Chưa xem</span>
          ),
      },
      {
        key: "actions",
        width: "220px",
        title: "Thao tác",
        render: (row) => {
          const isEdit =
            row.reportStatus === "Đã công bố" ||
            row.reportStatus === "Lưu nháp";

          return (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 w-[120px]"
                onClick={() =>
                  router.push(
                    `/teacher/score/${row.id}?classId=${classId}&term=${term}`
                  )
                }
              >
                <Edit size={14} /> {isEdit ? "Sửa điểm" : "Nhập điểm"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                title="Hồ sơ học sinh"
                onClick={() =>
                  router.push(
                    `/teacher/classes/${classId}/students/${row.id}`
                  )
                }
              >
                <UserCog size={16} className="text-slate-500" />
              </Button>
            </div>
          );
        },
      },
    ];
  }, [classId, term, router, filters, getFilterIconColor]);

  return (
    <PageContainer
      title="Danh sách học sinh"
      subtitle={`Quản lý điểm số - ${term}`}
    >
      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex flex-col sm:flex-row justify-between items-end gap-4 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="ghost"
            onClick={() => router.push("/teacher/classes")}
            className="pl-0 gap-1 text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft size={18} /> Quay lại
          </Button>

          <div className="h-6 w-px bg-slate-300 mx-2"></div>

          <Select
            value={term}
            onChange={setTerm}
            style={{ width: 140 }}
            options={[
              { value: "HK1", label: "Học kỳ 1" },
              { value: "HK2", label: "Học kỳ 2" },
            ]}
          />
        </div>

        {(filters.studentCode ||
          filters.fullName ||
          filters.status !== "ALL") && (
            <Button
              variant="ghost"
              onClick={() =>
                setFilters({
                  studentCode: "",
                  fullName: "",
                  status: "ALL",
                })
              }
              className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3.5 rounded-lg border border-red-100 transition-all flex items-center gap-1.5 shadow-sm hover:shadow"
            >
              <X size={16} className="shrink-0" />
              <span className="text-sm font-medium">Xóa bộ lọc</span>
            </Button>
          )}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          data={filteredStudents}
          emptyText="Không tìm thấy học sinh nào phù hợp."
        />
      )}
    </PageContainer>
  );
}
