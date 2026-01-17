"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { teacherService } from "@/services/teacher/teacher.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Select } from "antd";
import TeacherImages from "@/components/ui/TeacherImages";
import { Grade, UpsertReportPayload } from "@/types/teacher.types";
import { Spin, message, Input as AntInput } from "antd";

const { Option } = Select;
const { TextArea } = AntInput;
type ScoreRow = {
  subject: string;
  score: number | null;
  comment: string;
};

const generateComment = (score: number | null): string => {
  if (score === null) return "Chưa có nhận xét.";
  if (score >= 8.0) return "Giỏi";
  if (score >= 6.5) return "Khá";
  if (score >= 5.0) return "Trung bình";
  if (score >= 4.0) return "Yếu";
  return "Kém";
};

export default function TeacherStudentScorePage({ params }: { params: Promise<{ studentId: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { studentId } = use(params);

  const classId = searchParams.get("classId");
  const term = searchParams.get("term");
  const queryClient = useQueryClient();

  const [rows, setRows] = useState<ScoreRow[]>([]);
  const [generalComment, setGeneralComment] = useState("");
  const [saved, setSaved] = useState(false);

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
    if (subjects) {
      const initialRows: ScoreRow[] = subjects.map(sub => {
        const existGrade = report?.grades?.find(g => g.subject === sub.name);
        return {
          subject: sub.name,
          score: existGrade?.score ?? null,
          comment: existGrade?.comment || generateComment(existGrade?.score || null)
        };
      });
      setRows(initialRows);
      setGeneralComment(report?.generalComment || "");
    }
  }, [report, subjects]);

  const saveMutation = useMutation({
    mutationFn: (payload: UpsertReportPayload) => teacherService.saveReport(payload),
    onSuccess: () => {
      setSaved(true);
      message.success("Lưu thành công!");
      queryClient.invalidateQueries({ queryKey: ["class-students", classId, term] });
      setTimeout(() => setSaved(false), 3000);
    },
    onError: () => message.error("Lỗi khi lưu điểm")
  });

  const handleSave = (isPublished: boolean = true) => {
    if (!classId || !term) return;

    const gradesPayload: Grade[] = rows
      .filter(row => row.score !== null)
      .map(row => ({
        subject: row.subject,
        score: row.score as number,
        comment: row.comment
      }));

    const payload: UpsertReportPayload = {
      studentId,
      classId,
      term,
      grades: gradesPayload,
      generalComment,
      isPublished
    };

    saveMutation.mutate(payload);
  };

  const handleChange = (index: number, field: keyof ScoreRow, value: any) => {
    setRows(prev => prev.map((row, i) => {
      if (i === index) {
        const updatedRow = { ...row, [field]: value };
        if (field === "score") {
          updatedRow.comment = generateComment(value);
        }
        return updatedRow;
      }
      return row;
    }));
    setSaved(false);
  };

  if (isLoading || !subjects) return <div className="flex justify-center p-20"><Spin size="large" /></div>;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            className="rounded-full border-2 border-pink-200 text-pink-600 hover:bg-pink-100 cursor-pointer"
          >
            <div onClick={() => router.back()} className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </div>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Nhập điểm học sinh
            </h1>
            <p className="text-sm sm:text-base text-pink-600 mt-1 truncate">
              Học sinh: <span className="font-bold">{report?.student?.fullName || "Đang tải..."}</span> - Kỳ: {term}
            </p>
          </div>
        </div>
        <div className="hidden lg:block">
          <TeacherImages size={70} layout="carousel" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-2 border-pink-200 bg-white shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-pink-100">
                <thead className="bg-gradient-to-r from-pink-100 to-purple-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-pink-900 w-[30%] rounded-tl-lg">
                      Môn học
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-pink-900 w-[20%]">
                      Điểm Tổng
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-pink-900 w-[50%] rounded-tr-lg">
                      Nhận xét chi tiết
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50 bg-white">
                  {rows.map((row, idx) => (
                    <motion.tr
                      key={row.subject}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      className="hover:bg-pink-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-pink-900">{row.subject}</td>

                      <td className="px-6 py-4 text-center">
                        <Select
                          value={row.score}
                          placeholder="Chọn điểm"
                          onChange={(value) => handleChange(idx, "score", value)}
                          className="w-[100px]"
                        >
                          {[...Array(11)].map((_, i) => (
                            <Option key={i} value={i}>
                              {i}
                            </Option>
                          ))}
                        </Select>
                      </td>

                      <td className="px-6 py-4">
                        <div className="border border-pink-200 rounded-lg p-2 text-sm text-pink-900">
                          {row.comment || "Chưa có nhận xét"}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="shadow-lg border-2 border-pink-100">
          <CardHeader>
            <CardTitle className="text-pink-900">Nhận xét chung & Hạnh kiểm</CardTitle>
          </CardHeader>
          <CardContent>
            <TextArea
              rows={4}
              value={generalComment}
              onChange={(e) => setGeneralComment(e.target.value)}
              placeholder="Nhận xét tổng quát về nề nếp, chuyên cần..."
              className="border-pink-200 focus:border-pink-500 rounded-xl text-base"
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end gap-3 pb-10"
      >
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="rounded-full border-2 border-pink-200 text-pink-600 hover:bg-pink-50"
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={() => handleSave(false)}
          disabled={saveMutation.isPending}
          className="rounded-full bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 shadow-md"
        >
          Lưu nháp
        </Button>
        <Button
          onClick={() => handleSave(true)}
          disabled={saveMutation.isPending}
          className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl px-8"
        >
          {saveMutation.isPending ? "Đang lưu..." : (
            <>
              Công bố điểm
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}