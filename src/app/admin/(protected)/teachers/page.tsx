"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { teacherService } from "@/services/admin/teacher.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spin, Tag, Popconfirm, message } from "antd";
import { Edit, Trash2, Plus, Eye } from "lucide-react";

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

  const rows = Array.isArray(data)
    ? data.map((teacher) => ({
      id: teacher.id,
      name: teacher.fullName,
      phoneNumber: teacher.phoneNumber,
      isActive: teacher.isActive,
      classCount: teacher.managedClassIds?.length || 0,
    }))
    : [];

  const columns = useMemo(
    () => [
      {
        key: "name",
        title: "Họ tên",
        render: (row: typeof rows[0]) => (
          <span
            onClick={() => router.push(`/admin/teachers/${row.id}`)}
            className="w-[200px] font-medium text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
          >
            {row.name}
          </span>
        )
      },
      {
        key: "phoneNumber", title: "Số điện thoại",
        render: (row: typeof rows[0]) => <div className="w-[120px]">{row.phoneNumber}</div>
      },

      {
        key: "isActive",
        title: "Trạng thái",
        render: (row: typeof rows[0]) => (
          <div className="w-[100px]">
            <Tag color={row.isActive ? "green" : "red"}>
              {row.isActive ? "Hoạt động" : "Đã khóa"}
            </Tag>
          </div>
        ),
      },
      {
        key: "classCount",
        title: "Lớp chủ nhiệm",
        render: (row: typeof rows[0]) => (
          <div className="w-[100px] text-center font-medium">
            {row.classCount}
          </div>
        ),
      },
      {
        key: "actions",
        title: "",
        render: (row: typeof rows[0]) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              title="Sửa"
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
              <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" title="Xóa">
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
          className="w-full sm:w-auto flex items-center gap-2"
          onClick={() => router.push("/admin/teachers/create")}
        >
          <Plus className="h-4 w-4" /> Thêm giáo viên
        </Button>
      </div>

      <Table columns={columns} data={rows} />
    </PageContainer>
  );
}