"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table"; // Tái sử dụng bảng
import { classService } from "@/services/admin/class.service";
import { studentService } from "@/services/admin/student.service";
import { useQuery } from "@tanstack/react-query";
import { Spin, Tag } from "antd";
import { ArrowLeft, Users, Calendar, UserPlus } from "lucide-react";
import { Student } from "@/types/admin.types";

export default function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  // 1. Fetch thông tin lớp
  const { data: classData, isLoading: loadingClass } = useQuery({
    queryKey: ["class", id],
    queryFn: () => classService.getById(id),
  });

  // 2. Fetch danh sách học sinh của lớp
  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ["class-students", id],
    queryFn: () => studentService.getByClass(id),
    enabled: !!id // Chỉ chạy khi có id
  });

  if (loadingClass) return <div className="flex justify-center p-10"><Spin size="large" /></div>;
  if (!classData) return <div className="p-10 text-center">Không tìm thấy lớp học</div>;

  // Cấu hình bảng học sinh
  const studentColumns = [
    { key: "studentCode", title: "Mã HS" },
    { key: "fullName", title: "Họ và tên" },
    { 
      key: "dateOfBirth", title: "Ngày sinh",
      render: (row: Student) => row.dateOfBirth ? new Date(row.dateOfBirth).toLocaleDateString('vi-VN') : "-"
    },
    { key: "gender", title: "Giới tính" },
    { 
      key: "parentPhone", title: "SĐT Phụ huynh",
      render: (row: Student) => row.parentPhones?.join(", ") || "-"
    }
  ];

  return (
    <PageContainer title={`Chi tiết lớp ${classData.className}`} subtitle="Thông tin và danh sách học sinh">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 pl-0 hover:bg-transparent hover:text-blue-600">
          <ArrowLeft size={18} /> Quay lại danh sách
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Thông tin lớp */}
        <Card>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{classData.className}</h2>
              <div className="flex gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500"/> 
                  Niên khóa: <span className="font-semibold text-gray-800">{classData.schoolYear}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-blue-500"/> 
                  Sĩ số: <span className="font-semibold text-gray-800">{classData._count?.students || 0}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
               <p className="text-sm text-gray-500 mb-1">Trạng thái GVCN</p>
               {classData.teacherIds && classData.teacherIds.length > 0 ? (
                 <Tag color="green">Đã phân công</Tag>
               ) : (
                 <Tag color="orange">Chưa phân công</Tag>
               )}
            </div>
          </div>
        </Card>

        {/* Danh sách học sinh */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Danh sách học sinh</h3>
            <Button size="sm" onClick={() => router.push(`/admin/students/import`)} className="gap-2">
              <UserPlus size={16}/> Import Học sinh
            </Button>
          </div>
          
          {loadingStudents ? <div className="text-center py-4"><Spin/></div> : (
            <Table 
              columns={studentColumns} 
              data={Array.isArray(students) ? students : []} 
              emptyText="Lớp này chưa có học sinh nào."
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}