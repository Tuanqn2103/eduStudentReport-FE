"use client";


import PageContainer from "@/components/layout/PageContainer";
import StudentForm from "@/components/features/admin/StudentForm";
import { studentService } from "@/services/admin/student.service";
import { message, Button, Card, Divider } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, Copy, User, Hash, RefreshCcw } from "lucide-react";

export default function CreateStudentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ fullName: string; pin: string; studentCode: string } | null>(null);

  const preSelectedClassId = searchParams.get("classId") || undefined;
  const handleCreate = async (data: any) => {
    try {
      setLoading(true);
      const res: any = await studentService.create(data);
      setSuccessData(res.data);
      message.success("Tạo học sinh thành công!");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err?.response?.data?.message || "Lỗi khi tạo học sinh");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (successData?.pin) {
      navigator.clipboard.writeText(successData.pin);
      message.success("Đã copy mã PIN!");
    }
  };

  if (successData) {
    return (
      <PageContainer title="Tạo học sinh thành công">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Card className="w-full max-w-lg shadow-xl border-t-4 border-t-green-500 rounded-xl overflow-hidden">
            <div className="text-center pt-6 pb-2">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Tạo hồ sơ thành công!</h2>
              <p className="text-slate-500 mt-1">Học sinh đã được thêm vào hệ thống.</p>
            </div>

            <div className="px-8 py-6">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-6">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200">
                  <span className="text-slate-500 text-sm flex items-center gap-2">
                    <User size={14} /> Họ và tên
                  </span>
                  <span className="font-semibold text-slate-800 text-lg">{successData.fullName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-sm flex items-center gap-2">
                    <Hash size={14} /> Mã học sinh
                  </span>
                  <span className="font-mono text-blue-600 font-bold">{successData.studentCode}</span>
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl p-6 text-center relative group">
                <p className="text-amber-800 text-xs font-bold uppercase tracking-widest mb-2">
                  Mã PIN Đăng nhập (Phụ huynh)
                </p>
                <div className="text-5xl font-mono font-black text-slate-800 tracking-[0.2em] mb-2 drop-shadow-sm">
                  {successData.pin}
                </div>
                <Button
                  type="dashed"
                  size="small"
                  className="mt-2 border-amber-400 text-amber-700 hover:text-amber-800 hover:border-amber-600 bg-white"
                  icon={<Copy size={14} />}
                  onClick={copyToClipboard}
                >
                  Sao chép mã
                </Button>
                <p className="text-[11px] text-red-500 mt-4 italic opacity-80">
                  * Vui lòng lưu lại ngay. Mã này sẽ bị ẩn sau khi rời trang.
                </p>
              </div>
            </div>

            <Divider className="my-0" />

            <div className="bg-slate-50 p-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="large" onClick={() => router.push("/admin/students")} icon={<ArrowLeft size={16} />}>
                Về danh sách
              </Button>
              <Button
                size="large"
                type="primary"
                onClick={() => setSuccessData(null)}
                className="bg-blue-600"
                icon={<RefreshCcw size={16} />}
              >
                Tạo thêm học sinh
              </Button>
            </div>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Thêm học sinh mới" subtitle="Tạo hồ sơ học sinh và cấp mã PIN">
      <StudentForm 
        onSubmit={handleCreate} 
        isLoading={loading} 
        initialData={preSelectedClassId ? { classId: preSelectedClassId } as any : undefined}
      />
    </PageContainer>
  );
}