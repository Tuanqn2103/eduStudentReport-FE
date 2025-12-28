"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "@/services/teacher/teacher.service";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spin, message, Radio, DatePicker, Tag, Card } from "antd";
import {
  ArrowLeft,
  Save,
  User,
  Phone,
  Calendar,
  BookOpen,
  Fingerprint,
} from "lucide-react";
import dayjs from "dayjs";
import { UpdateStudentPayload } from "@/types/teacher.types";

interface PageParams {
  classId: string;
  studentId: string;
}

export default function StudentDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const router = useRouter();
  const { classId, studentId } = use(params);
  const queryClient = useQueryClient();

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    gender: "Nam",
    dateOfBirth: null as dayjs.Dayjs | null,
    parentPhones: "",
  });

  const { data: student, isLoading } = useQuery({
    queryKey: ["teacher-student-detail", studentId],
    queryFn: () => teacherService.getStudentDetail(studentId),
    enabled: !!studentId,
  });

  useEffect(() => {
    if (!student) return;
    setFormData({
      gender: student.gender || "Nam",
      dateOfBirth: student.dateOfBirth ? dayjs(student.dateOfBirth) : null,
      parentPhones: student.parentPhones?.join(", ") || "",
    });
  }, [student]);

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateStudentPayload) =>
      teacherService.updateStudent(studentId, payload),
    onSuccess: () => {
      message.success("Cập nhật hồ sơ thành công!");
      queryClient.invalidateQueries({
        queryKey: ["teacher-student-detail", studentId],
      });
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || "Lỗi khi cập nhật");
    },
  });

  const handleSave = () => {
    const phones = formData.parentPhones
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const payload: UpdateStudentPayload = {
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth?.toISOString(),
      parentPhones: phones,
    };

    setSaving(true);
    updateMutation.mutate(payload, {
      onSettled: () => setSaving(false),
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <Spin size="large" />
      </div>
    );

  if (!student)
    return (
      <div className="text-center p-10 text-slate-500">Không tìm thấy học sinh</div>
    );

  return (
    <PageContainer
      title="Hồ sơ học sinh"
      subtitle="Xem và cập nhật thông tin liên lạc"
      className="pb-8"
    >
      <Button
        variant="ghost"
        onClick={() => router.push(`/teacher/classes/${classId}`)}
        className="mb-6 pl-0 gap-2 text-pink-600 hover-text:bg-pink-200 cursor-pointer"
      >
        <ArrowLeft size={18} />
        Quay lại
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
            <div className="px-6 pb-6 relative">
              <div className="ml-0 mt-6">
                <h2 className="text-lg font-semibold text-slate-800">
                  {student.fullName}
                </h2>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="p-2 bg-pink-50 rounded-md text-pink-500">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Lớp</div>
                    <div className="text-sm font-medium text-slate-800">
                      {student.class?.className || "..."}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="p-2 bg-pink-50 rounded-md text-pink-500">
                    <Fingerprint size={16} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Niên khóa</div>
                    <div className="text-sm text-slate-800">
                      {(student.class as any)?.schoolYear || "..."}
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-xs text-slate-500">Mã học sinh</div>
                  <div className="text-sm text-slate-800 font-medium">
                    {student.studentCode}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <Card className="rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 flex items-start justify-between border-b border-pink-100 bg-pink-50/30">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-white shadow-sm text-pink-500">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800">
                    Thông tin cá nhân & Liên lạc
                  </h3>
                  <div className="text-sm text-slate-500">
                    Giáo viên chỉ được phép chỉnh sửa các thông tin bên dưới.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Giới tính
                  </label>

                  <div
                    role="tablist"
                    aria-label="Giới tính"
                    className="inline-flex rounded-lg p-1 bg-white border border-slate-100 shadow-sm"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-pressed={formData.gender === "Nam"}
                      onClick={() => setFormData({ ...formData, gender: "Nam" })}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-pink-200 cursor-pointer ${formData.gender === "Nam"
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow"
                          : "bg-white text-slate-700"
                        }`}
                    >
                      Nam
                    </button>

                    <button
                      type="button"
                      role="tab"
                      aria-pressed={formData.gender === "Nữ"}
                      onClick={() => setFormData({ ...formData, gender: "Nữ" })}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-pink-200 cursor-pointer ${formData.gender === "Nữ"
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow"
                          : "bg-white text-slate-700"
                        }`}
                    >
                      Nữ
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"
                  >
                    <Calendar size={16} className="text-pink-500" />
                    Ngày sinh
                  </label>
                  <DatePicker
                    id="dateOfBirth"
                    className="w-full h-11 rounded-lg"
                    format="DD/MM/YYYY"
                    value={formData.dateOfBirth}
                    onChange={(date) =>
                      setFormData({ ...formData, dateOfBirth: date })
                    }
                    placeholder="Chọn ngày sinh"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="parentPhones"
                  className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"
                >
                  <Phone size={16} className="text-pink-500" />
                  Số điện thoại phụ huynh
                </label>
                <Input
                  id="parentPhones"
                  value={formData.parentPhones}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      parentPhones: e.target.value,
                    })
                  }
                  placeholder="VD: 0912xxx, 0988xxx"
                  className="h-11 rounded-lg"
                />
                <div className="text-xs text-slate-400 mt-2">
                  Thông tin quan trọng để phụ huynh đăng nhập vào hệ thống.
                </div>
              </div>

              <div className="pt-4 flex justify-end border-t border-slate-100">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="h-11 px-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md hover:shadow-lg transition flex items-center gap-2"
                >
                  {saving ? (
                    <Spin size="small" className="!text-white" />
                  ) : (
                    <Save size={16} />
                  )}
                  {saving ? "Đang lưu..." : "Cập nhật hồ sơ"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}