"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import type { Column } from "@/components/ui/Table";
import { Table } from "@/components/ui/Table";
import { teacherService } from "@/services/admin/teacher.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spin, Tag, Popconfirm, message } from "antd";
import { Edit, Trash2, Plus, Eye } from "lucide-react";

type TeacherRow = {
  id: string;
  name: string;
  phoneNumber: string;
  isActive: boolean;
  classCount: number;
};

export default function AdminTeachersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-teachers"],
    queryFn: () => teacherService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => teacherService.delete(id),
    onSuccess: () => {
      message.success("Xóa giáo viên thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-teachers"] });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Lỗi khi xóa");
    },
  });

  const rows: TeacherRow[] = Array.isArray(data)
    ? data.map((teacher) => ({
        id: teacher.id,
        name: teacher.fullName,
        phoneNumber: teacher.phoneNumber,
        isActive: teacher.isActive,
        classCount: teacher.managedClassIds?.length || 0,
      }))
    : [];

  const columns = useMemo<Column<TeacherRow>[]>(() => [
      {
        key: "name",
        title: "Họ tên",
        width: "30%",
        align: "left",
        render: (row: TeacherRow) => (
          <span
            onClick={() => router.push(`/admin/teachers/${row.id}`)}
            className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
          >
            {row.name}
          </span>
        ),
      },
      {
        key: "phoneNumber",
        title: "Số điện thoại",
        width: "20%",
        align: "left",
        render: (row: TeacherRow) => <div className="w-[120px]">{row.phoneNumber}</div>,
      },
      {
        key: "isActive",
        title: "Trạng thái",
        width: "15%",
        align: "center",
        render: (row: TeacherRow) => (
          <div className="flex justify-center">
            <Tag color={row.isActive ? "green" : "red"}>
              {row.isActive ? "Hoạt động" : "Đã khóa"}
            </Tag>
          </div>
        ),
      },
      {
        key: "classCount",
        title: "Lớp chủ nhiệm",
        width: "10%",
        align: "center",
        render: (row: TeacherRow) => (
          <div className="text-center font-medium">{row.classCount}</div>
        ),
      },
      {
        key: "actions",
        title: "Thao tác",
        width: "15%",
        align: "right",
        render: (row: TeacherRow) => (
          <div className="flex gap-2 justify-end items-center">
            <Button size="sm" variant="ghost" onClick={() => router.push(`/admin/teachers/${row.id}`)} title="Chi tiết">
              <Eye className="h-4 w-4 text-slate-500 cursor-pointer" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              title="Sửa"
              className="cursor-pointer"
              onClick={() => router.push(`/admin/teachers/${row.id}/edit`)}
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Popconfirm
              title="Xóa giáo viên?"
              description="Hành động này không thể hoàn tác."
              onConfirm={() => deleteMutation.mutate(row.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true, loading: deleteMutation.isPending }}
            >
              <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50 cursor-pointer" title="Xóa">
                <Trash2 className="h-4 w-4" />
              </Button>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [deleteMutation, router]
  );

  if (isLoading) {
    return <div className="flex justify-center p-10"><Spin size="large" /></div>;
  }

  return (
    <PageContainer title="Quản lý giáo viên" subtitle="Danh sách giáo viên trong hệ thống">
      <div className="mb-4 flex flex-col sm:flex-row justify-end gap-2">
        <Button
          className="w-full sm:w-auto flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/admin/teachers/create")}
        >
          <Plus className="h-4 w-4" /> Thêm giáo viên
        </Button>
      </div>

      <Table columns={columns} data={rows} />
    </PageContainer>
  );
}