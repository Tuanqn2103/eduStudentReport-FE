"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { studentService } from "@/services/admin/student.service";
import { classService } from "@/services/admin/class.service"; // Để lấy tên lớp
import { useQuery } from "@tanstack/react-query";
import { Spin, Tag, Descriptions, Avatar } from "antd"; // Dùng Descriptions của Antd cho đẹp
import { ArrowLeft, Edit, Phone, User, Calendar, BookOpen, KeyRound } from "lucide-react";

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  // 1. Fetch thông tin học sinh
  const { data: student, isLoading: loadingStudent } = useQuery({
    queryKey: ["student", id],
    queryFn: () => studentService.getById(id),
  });

  // 2. Fetch thông tin lớp (nếu học sinh đã được gán lớp)
  const { data: classData, isLoading: loadingClass } = useQuery({
    queryKey: ["class-info", student?.classId],
    queryFn: () => classService.getById(student!.classId),
    enabled: !!student?.classId, // Chỉ chạy khi đã có thông tin học sinh
  });

  if (loadingStudent) return <div className="flex justify-center p-20"><Spin size="large" /></div>;
  if (!student) return <div className="text-center p-10 text-gray-500">Không tìm thấy hồ sơ học sinh.</div>;

  return (
    <PageContainer 
      title="Hồ sơ học sinh" 
      subtitle={`Thông tin chi tiết của: ${student.fullName}`}
    >
      <div className="mb-6 flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="gap-2 pl-0 hover:bg-transparent hover:text-blue-600"
        >
          <ArrowLeft size={18} /> Quay lại danh sách
        </Button>

        <Button 
          variant="outline" 
          onClick={() => router.push(`/admin/students/${id}/edit`)}
          className="gap-2"
        >
          <Edit size={16} /> Chỉnh sửa hồ sơ
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CỘT TRÁI: Thông tin chính */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-blue-100 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Avatar giả lập */}
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white shadow-md">
                {student.fullName.charAt(0)}
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{student.fullName}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Tag color="blue" className="text-sm px-2 py-0.5 m-0 font-mono">
                      {student.studentCode}
                    </Tag>
                    {student.gender && (
                      <Tag color={student.gender === "Nam" ? "cyan" : "magenta"} className="m-0">
                        {student.gender}
                      </Tag>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Calendar size={16} /> Ngày sinh
                    </p>
                    <p className="font-medium text-gray-900">
                      {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('vi-VN') : "Chưa cập nhật"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <BookOpen size={16} /> Lớp học
                    </p>
                    {loadingClass ? <Spin size="small"/> : (
                      <p 
                        className="font-medium text-blue-600 cursor-pointer hover:underline"
                        onClick={() => classData && router.push(`/admin/classes/${classData.id}`)}
                      >
                        {classData ? `${classData.className} (${classData.schoolYear})` : "Chưa phân lớp"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Thông tin phụ huynh */}
          <Card>
  {/* Đưa title vào trong thành thẻ h3 */}
  <h3 className="font-bold text-gray-900 mb-4 text-lg">
    Thông tin liên lạc (Phụ huynh)
  </h3>
  
  <div className="space-y-4">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-green-50 rounded-lg">
        <Phone size={20} className="text-green-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 mb-2">Số điện thoại đăng ký:</p>
        {student.parentPhones && student.parentPhones.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {student.parentPhones.map((phone, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md text-gray-700 font-mono">
                {phone}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Chưa có số điện thoại</p>
        )}
      </div>
    </div>
  </div>
</Card>
        </div>

        {/* CỘT PHẢI: Các hành động / Ghi chú */}
        <div className="space-y-6">
          {/* Card PIN - Bảo mật */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white rounded-full shadow-sm">
                <KeyRound size={20} className="text-amber-600" />
              </div>
              <h3 className="font-bold text-amber-900">Mã PIN Phụ huynh</h3>
            </div>
            <p className="text-sm text-amber-800 mb-4">
              Mã PIN được dùng để phụ huynh đăng nhập. Mã này đã được mã hóa trong hệ thống.
            </p>
            <Button className="w-full bg-white text-amber-700 hover:bg-amber-100 border-amber-200">
              Cấp lại mã PIN mới
            </Button>
          </Card>
        </div>

      </div>
    </PageContainer>
  );
}