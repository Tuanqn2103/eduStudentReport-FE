"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { studentService } from "@/services/admin/student.service";
import { classService } from "@/services/admin/class.service";
import { useQuery } from "@tanstack/react-query";
import { Spin, Tag, message, Alert } from "antd";
import { ArrowLeft, Edit, Phone, Calendar, BookOpen, KeyRound, RefreshCw, Copy } from "lucide-react";

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [newPin, setNewPin] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  const { data: student, isLoading: loadingStudent } = useQuery({
    queryKey: ["student", id],
    queryFn: () => studentService.getById(id),
  });

  const { data: classData, isLoading: loadingClass } = useQuery({
    queryKey: ["class-info", student?.classId],
    queryFn: () => classService.getById(student!.classId),
    enabled: !!student?.classId,
  });

  const handleResetPin = async () => {
    try {
      setResetting(true);
      const res: any = await studentService.resetPin(id);

      const pin = res.data?.newPin || res.newPin;

      setNewPin(pin);
      message.success("Cấp lại mã PIN thành công!");
    } catch (error) {
      message.error("Lỗi khi cấp lại mã PIN");
    } finally {
      setResetting(false);
    }
  };

  const copyToClipboard = () => {
    if (newPin) {
      navigator.clipboard.writeText(newPin);
      message.success("Đã copy mã PIN!");
    }
  };

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

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-blue-100 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
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
                    {loadingClass ? <Spin size="small" /> : (
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

          <Card>
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

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white rounded-full shadow-sm">
                <KeyRound size={20} className="text-amber-600" />
              </div>
              <h3 className="font-bold text-amber-900">Mã PIN Phụ huynh</h3>
            </div>

            <p className="text-sm text-amber-800 mb-4">
              Mã PIN được dùng để phụ huynh đăng nhập. Vì lý do bảo mật, bạn không thể xem mã cũ.
            </p>

            {newPin ? (
              <div className="bg-white p-4 rounded-lg border-2 border-amber-400 mb-4 text-center animate-in zoom-in duration-300">
                <p className="text-xs text-gray-500 mb-1">Mã PIN mới của học sinh:</p>
                <div className="text-3xl font-bold text-amber-600 tracking-widest font-mono mb-2">
                  {newPin}
                </div>
                <Button size="sm" variant="outline" onClick={copyToClipboard} className="w-full gap-2">
                  <Copy size={14} /> Copy mã PIN
                </Button>
                <p className="text-xs text-red-500 mt-2 italic">
                  * Hãy gửi mã này cho phụ huynh ngay.
                </p>
              </div>
            ) : (
              <Button
                onClick={handleResetPin}
                loading={resetting}
                className="w-full bg-white text-amber-700 hover:bg-amber-100 border-amber-200 gap-2"
              >
                <RefreshCw size={16} /> Cấp lại mã PIN mới
              </Button>
            )}
          </Card>
        </div>

      </div>
    </PageContainer>
  );
}