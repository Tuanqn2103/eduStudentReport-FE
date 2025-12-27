"use client";

import { use } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { teacherService } from "@/services/admin/teacher.service";
import { useQuery } from "@tanstack/react-query";
import { Spin, Tag } from "antd";
import { ArrowLeft, Edit, Phone, User, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();

    const { id } = use(params);

    const { data: teacher, isLoading } = useQuery({
        queryKey: ["teacher", id],
        queryFn: () => teacherService.getById(id),
    });

    if (isLoading) return <div className="flex justify-center p-10"><Spin size="large" /></div>;
    if (!teacher) return <div className="text-center p-10">Không tìm thấy giáo viên</div>;

    return (
        <PageContainer
            title="Thông tin chi tiết"
            subtitle="Xem thông tin hồ sơ và lớp chủ nhiệm"
        >
            <div className="mb-6">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2 pl-0 hover:bg-transparent hover:text-blue-600 cursor-pointer">
                    <ArrowLeft size={18} /> Quay lại danh sách
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{teacher.fullName}</h2>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                                onClick={() => router.push(`/admin/teachers/${teacher.id}/edit`)}
                            >
                                <Edit size={16} className="mr-2" /> Chỉnh sửa
                            </Button>
                        </div>

                        <div className="flex justify-between items-end">

                            <div className="space-y-1.5">
                                <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Phone size={16} className="text-blue-500" />
                                    Số điện thoại
                                </p>
                                <p className="text-lg text-gray-900 font-semibold tracking-wide">
                                    {teacher.phoneNumber}
                                </p>
                            </div>

                            <div className="space-y-1.5 flex flex-col items-end mr-4">
                                <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <User size={16} className="text-blue-500" />
                                    Trạng thái
                                </p>
                                <div>
                                    {teacher.isActive ? (
                                        <Tag color="green" className="m-0 px-3 py-0.5 text-sm">
                                            Đang hoạt động
                                        </Tag>
                                    ) : (
                                        <Tag color="red" className="m-0 px-3 py-0.5 text-sm">
                                            Đã khóa
                                        </Tag>
                                    )}
                                </div>
                            </div>

                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <BookOpen size={20} className="text-blue-600" />
                            Lớp chủ nhiệm ({teacher.managedClassIds?.length || 0})
                        </h3>

                        {teacher.managedClasses && teacher.managedClasses.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {teacher.managedClasses.map((cls) => (
                                    <div
                                        key={cls.id}
                                        className="p-3 border rounded-lg bg-gray-50 text-center hover:border-blue-500 transition-colors cursor-pointer group"
                                        onClick={() => router.push(`/admin/classes`)}
                                    >
                                        <span className="font-bold text-lg text-blue-600 block group-hover:scale-105 transition-transform">
                                            {cls.className}
                                        </span>
                                        <span className="text-xs text-gray-500">{cls.schoolYear}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm italic">Chưa được phân công lớp nào.</p>
                        )}
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                        <h3 className="font-semibold text-blue-900 mb-2">Ghi chú quản trị</h3>
                        <p className="text-sm text-blue-700 mb-4">
                            Thông tin giáo viên được cập nhật lần cuối từ hệ thống.
                        </p>
                        <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 border-blue-200 cursor-pointer">
                            Reset Mật khẩu
                        </Button>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}