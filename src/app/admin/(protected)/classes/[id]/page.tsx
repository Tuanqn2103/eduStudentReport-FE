"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, Column } from "@/components/ui/Table";
import { classService } from "@/services/admin/class.service";
import { studentService } from "@/services/admin/student.service";
import { useQuery } from "@tanstack/react-query";
import { Spin, Tag } from "antd";
import { ArrowLeft, Users, Calendar, UserPlus, UploadCloud } from "lucide-react";
import { Student } from "@/types/admin.types";

export default function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: classData, isLoading: loadingClass } = useQuery({
    queryKey: ["class", id],
    queryFn: () => classService.getById(id),
  });

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ["class-students", id],
    queryFn: () => studentService.getByClass(id),
    enabled: !!id
  });

  if (loadingClass) {
    return <div className="flex justify-center p-20"><Spin size="large" /></div>;
  }

  if (!classData) {
    return <div className="text-center p-10 text-gray-500">Không tìm thấy thông tin lớp học.</div>;
  }
  const studentColumns: Column<Student>[] = [
    { 
      key: "studentCode", 
      title: "Mã HS",
      render: (row) => <span className="font-mono font-medium">{row.studentCode}</span>
    },
    { 
      key: "fullName", 
      title: "Họ và tên",
      render: (row) => <span className="font-medium text-[#000000]">{row.fullName}</span>
    },
    { 
      key: "dateOfBirth", 
      title: "Ngày sinh",
      render: (row) => row.dateOfBirth ? new Date(row.dateOfBirth).toLocaleDateString('vi-VN') : "-"
    },
    { 
      key: "gender", 
      title: "Giới tính" 
    },
    { 
      key: "parentPhones", 
      title: "SĐT Phụ huynh",
      render: (row) => (
        <div className="flex flex-col">
          {row.parentPhones?.map((phone, idx) => (
            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded w-fit mb-1 last:mb-0">
              {phone}
            </span>
          )) || "-"}
        </div>
      )
    }
  ];

  return (
    <PageContainer 
      title={`Chi tiết lớp ${classData.className}`} 
      subtitle="Thông tin chung và danh sách học sinh"
    >
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="gap-2 pl-0 hover:bg-transparent hover:text-blue-600 cursor-pointer"
        >
          <ArrowLeft size={18} /> Quay lại
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-white border-blue-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-2">{classData.className}</h2>
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
               <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Giáo viên chủ nhiệm</p>
               {classData.teacherIds && classData.teacherIds.length > 0 ? (
                 <Tag color="green" className="text-sm px-3 py-1">Đã phân công</Tag>
               ) : (
                 <Tag color="orange" className="text-sm px-3 py-1">Chưa phân công</Tag>
               )}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#000000] flex items-center gap-2">
              <Users size={20} className="text-gray-500" />
              Danh sách học sinh
            </h3>
            
            <Button 
              size="sm" 
              onClick={() => router.push(`/admin/students/create?classId=${id}`)} 
              className="gap-2"
            >
              <UserPlus size={16}/> Thêm học sinh
            </Button>
          </div>
          
          {loadingStudents ? (
            <div className="flex justify-center py-10"><Spin /></div>
          ) : (
            <Table 
              columns={studentColumns} 
              data={Array.isArray(students) ? students : []} 
              emptyText="Lớp này chưa có học sinh nào. Hãy import danh sách."
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}