"use client";

import type { Column } from "@/components/ui/Table";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { studentService } from "@/services/admin/student.service";
import { classService } from "@/services/admin/class.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spin, Popconfirm, message, Select } from "antd";
import { Edit, Trash2, Plus, UploadCloud, Eye } from "lucide-react";
import { Student } from "@/types/admin.types";

export default function AdminStudentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>();

  const { data: classes, isLoading: loadingClasses } = useQuery({
    queryKey: ["admin-classes-select"],
    queryFn: () => classService.getAll(),
  });

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ["admin-students", selectedClassId],
    queryFn: () => studentService.getByClass(selectedClassId!),
    enabled: !!selectedClassId,
  });

  const handleNavigate = (path: string) => {
    if (selectedClassId) {
      router.push(`${path}?classId=${selectedClassId}`);
    } else {
      router.push(path);
    }
  };
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => studentService.delete(id),
    onSuccess: () => {
      message.success("Xóa học sinh thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-students", selectedClassId] });
    },
    onError: () => message.error("Lỗi khi xóa"),
  });

  const columns = useMemo<Column<Student>[]>(() => [
    { key: "studentCode", title: "Mã HS", width: "12%", align: "left" },
    {
      key: "fullName",
      title: "Họ tên",
      width: "40%",
      align: "left",
      render: (row: Student) => (
        <span
          className="font-medium text-blue-600 cursor-pointer hover:underline"
          onClick={() => router.push(`/admin/students/${row.id}`)}
        >
          {row.fullName}
        </span>
      ),
    },
    { key: "gender", title: "Giới tính", width: "12%", align: "center" },
    {
      key: "dateOfBirth",
      title: "Ngày sinh",
      width: "21%",
      align: "center",
      render: (row: Student) =>
        row.dateOfBirth ? new Date(row.dateOfBirth).toLocaleDateString("vi-VN") : "-",
    },
    {
      key: "actions",
      title: "Thao tác",
      width: "15%",
      align: "right",
      render: (row: Student) => (
        <div className="flex gap-2 justify-end items-center">
          <Button size="sm" variant="ghost" onClick={() => router.push(`/admin/students/${row.id}`)} title="Chi tiết">
            <Eye className="h-4 w-4 text-slate-500" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => router.push(`/admin/students/${row.id}/edit`)} title="Sửa">
            <Edit className="h-4 w-4" />
          </Button>
          <Popconfirm
            title="Xóa hồ sơ này?"
            onConfirm={() => deleteMutation.mutate(row.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, loading: deleteMutation.isPending }}
          >
            <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" title="Xóa">
              <Trash2 className="h-4 w-4" />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ], [deleteMutation, router]);

  return (
    <PageContainer title="Quản lý học sinh" subtitle="Danh sách và thông tin hồ sơ">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm font-medium text-gray-700">Chọn lớp:</span>
          <Select
            className="w-[200px]"
            placeholder="Vui lòng chọn lớp..."
            loading={loadingClasses}
            onChange={(value) => setSelectedClassId(value as string | undefined)}
            options={classes?.map((c) => ({ label: c.className, value: c.id }))}
            allowClear
          />
        </div>

        {selectedClassId && (
          <div className="flex gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => handleNavigate("/admin/students/import")}
              className="gap-2 cursor-pointer"
            >
              <UploadCloud className="h-4 w-4" /> Import Excel
            </Button>
            <Button 
              onClick={() => handleNavigate("/admin/students/create")}
              className="gap-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Thêm học sinh
            </Button>
          </div>
        )}
      </div>

      {!selectedClassId ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
          Vui lòng chọn một lớp học để xem danh sách học sinh.
        </div>
      ) : loadingStudents ? (
        <div className="flex justify-center p-10"><Spin size="large" /></div>
      ) : (
        <Table
          columns={columns}
          data={Array.isArray(students) ? students : []}
          emptyText="Lớp này chưa có học sinh nào."
        />
      )}
    </PageContainer>
  );
}