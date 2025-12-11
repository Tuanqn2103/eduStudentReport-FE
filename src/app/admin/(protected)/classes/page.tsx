"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import type { Column } from "@/components/ui/Table";
import { Table } from "@/components/ui/Table";
import { classService } from "@/services/admin/class.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spin, Tag, Popconfirm, message } from "antd";
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import { ClassItem } from "@/types/admin.types";

export default function AdminClassesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-classes"],
    queryFn: () => classService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => classService.delete(id),
    onSuccess: () => {
      message.success("Xóa lớp thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-classes"] });
    },
    onError: (err: any) => message.error(err?.response?.data?.message || "Lỗi xóa"),
  });

  const rows = Array.isArray(data) ? data : [];

  const columns = useMemo<Column<ClassItem>[]>(() => [
      {
        key: "className",
        title: "Tên lớp",
        width: "30%",
        align: "left",
        render: (row: ClassItem) => (
          <span
            className="font-medium text-blue-600 cursor-pointer hover:underline"
            onClick={() => router.push(`/admin/classes/${row.id}`)}
          >
            {row.className}
          </span>
        ),
      },
      { key: "schoolYear", title: "Niên khóa", width: "20%", align: "left" },
      {
        key: "students",
        title: "Sĩ số",
        width: "10%",
        align: "center",
        render: (row: ClassItem) => <div className="font-bold">{row._count?.students || 0}</div>,
      },
      {
        key: "homeroom",
        title: "GVCN",
        width: "15%",
        align: "center",
        render: (row: ClassItem) =>
          row.teacherIds && row.teacherIds.length > 0 ? (
            <Tag color="green">Đã có</Tag>
          ) : (
            <Tag color="orange">Chưa có</Tag>
          ),
      },
      {
        key: "actions",
        title: "Thao tác",
        width: "15%",
        align: "right",
        render: (row: ClassItem) => (
          <div className="flex gap-2 justify-end items-center">
            <Button size="sm" variant="ghost" onClick={() => router.push(`/admin/classes/${row.id}`)} title="Chi tiết">
              <Eye className="h-4 w-4 text-slate-500" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => router.push(`/admin/classes/${row.id}/edit`)} title="Sửa">
              <Edit className="h-4 w-4" />
            </Button>
            <Popconfirm
              title="Xóa lớp này?"
              description="Cảnh báo: Xóa lớp sẽ ảnh hưởng đến học sinh!"
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

  if (isLoading) return <div className="flex justify-center p-10"><Spin size="large"/></div>;

  return (
    <PageContainer title="Quản lý lớp học" subtitle="Danh sách lớp và phân công giáo viên">
      <div className="mb-4 flex justify-end">
        <Button onClick={() => router.push("/admin/classes/create")} className="flex gap-2">
          <Plus className="h-4 w-4" /> Tạo lớp mới
        </Button>
      </div>
      <Table columns={columns} data={rows} />
    </PageContainer>
  );
}