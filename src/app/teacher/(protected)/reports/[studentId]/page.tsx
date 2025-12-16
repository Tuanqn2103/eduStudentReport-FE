"use client";

import { use, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { teacherService } from "@/services/teacher/teacher.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spin, message, Input, InputNumber, Checkbox, Form, Divider } from "antd";
import { ArrowLeft, Save, Send } from "lucide-react";
import { Grade, UpsertReportPayload } from "@/types/teacher.types";

const { TextArea } = Input;

export default function GradeInputPage({ params }: { params: Promise<{ studentId: string }> }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { studentId } = use(params);

    const classId = searchParams.get("classId");
    const term = searchParams.get("term");
    const queryClient = useQueryClient();

    const [form] = Form.useForm();
    const [isPublished, setIsPublished] = useState(false);

    const { data: subjects } = useQuery({
        queryKey: ["subjects"],
        queryFn: teacherService.getSubjects
    });

    const { data: report, isLoading } = useQuery({
        queryKey: ["student-report", studentId, term],
        queryFn: () => teacherService.getStudentReport(studentId, String(term)),
        enabled: !!term
    });

    useEffect(() => {
        if (report && subjects) {
            const gradesObj: Record<string, any> = {};
            subjects.forEach(sub => {
                const existGrade = report.grades.find(g => g.subject === sub.name);
                gradesObj[`score_${sub.name}`] = existGrade?.score;
                gradesObj[`comment_${sub.name}`] = existGrade?.comment;
            });

            form.setFieldsValue({
                generalComment: report.generalComment,
                ...gradesObj
            });
            setIsPublished(report.isPublished);
        }
    }, [report, subjects, form]);

    const saveMutation = useMutation({
        mutationFn: (payload: UpsertReportPayload) => teacherService.saveReport(payload),
        onSuccess: () => {
            message.success("Lưu kết quả thành công!");
            queryClient.invalidateQueries({ queryKey: ["class-students", classId, term] });
            router.back();
        },
        onError: () => message.error("Lỗi khi lưu điểm")
    });

    const handleSave = (publish: boolean) => {
        form.validateFields().then(values => {
            if (!subjects || !classId || !term) return;

            const grades: Grade[] = subjects.map(sub => ({
                subject: sub.name,
                score: values[`score_${sub.name}`] ?? null,
                comment: values[`comment_${sub.name}`] || ""
            })).filter(g => g.score !== null && g.score !== undefined);

            const payload: UpsertReportPayload = {
                studentId,
                classId,
                term,
                grades,
                generalComment: values.generalComment,
                isPublished: publish
            };

            saveMutation.mutate(payload);
        });
    };

    if (isLoading || !subjects) return <div className="flex justify-center p-20"><Spin size="large" /></div>;

    return (
        <PageContainer
            title="Nhập điểm & Nhận xét"
            subtitle={`Học sinh: ${report?.student?.fullName || "..."} - Kỳ: ${term}`}
        >
            <div className="mb-6">
                <Button variant="ghost" onClick={() => router.back()} className="pl-0 gap-2 text-slate-500 hover:text-blue-600">
                    <ArrowLeft size={18} /> Quay lại danh sách
                </Button>
            </div>

            <div className="max-w-4xl mx-auto">
                <Form form={form} layout="vertical">
                    <Card className="mb-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">Bảng điểm chi tiết</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {subjects.map((sub) => (
                                <div key={sub.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 block"></span>
                                        {sub.name} ({sub.code})
                                    </div>
                                    <div className="flex gap-4">
                                        <Form.Item
                                            name={`score_${sub.name}`}
                                            className="mb-0 flex-1"
                                            rules={[{ type: 'number', min: 0, max: 10, message: '0-10' }]}
                                        >
                                            <InputNumber
                                                placeholder="Điểm số"
                                                className="w-full"
                                                min={0} max={10} step={0.1}
                                            />
                                        </Form.Item>
                                        <Form.Item name={`comment_${sub.name}`} className="mb-0 flex-[2]">
                                            <Input placeholder="Nhận xét môn học..." />
                                        </Form.Item>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="mb-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Nhận xét chung & Hạnh kiểm</h3>
                        <Form.Item name="generalComment">
                            <TextArea
                                rows={4}
                                placeholder="Nhập nhận xét tổng quát về học tập, nề nếp, chuyên cần..."
                                className="text-base"
                            />
                        </Form.Item>
                    </Card>

                    <div className="flex justify-end gap-4 pb-10">
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => handleSave(false)}
                            disabled={saveMutation.isPending}
                            className="gap-2"
                        >
                            <Save size={18} /> Lưu nháp
                        </Button>

                        <Button
                            size="lg"
                            onClick={() => handleSave(true)}
                            disabled={saveMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 gap-2 text-white"
                        >
                            <Send size={18} /> {isPublished ? "Cập nhật & Công bố" : "Công bố cho Phụ huynh"}
                        </Button>
                    </div>
                </Form>
            </div>
        </PageContainer>
    );
}