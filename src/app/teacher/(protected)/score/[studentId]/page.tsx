"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, CheckCircle, ArrowLeft, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { teacherService } from "@/services/teacher.service";
import TeacherImages from "@/components/ui/TeacherImages";
import Link from "next/link";

type ScoreRow = {
  subject: string;
  oral: string;
  quiz: string;
  midterm: string;
  final: string;
};

const defaultRows: ScoreRow[] = [
  { subject: "Toán", oral: "8.5", quiz: "8.0", midterm: "8.2", final: "8.8" },
  { subject: "Tiếng Việt", oral: "9.0", quiz: "8.8", midterm: "9.0", final: "9.2" },
  { subject: "Tiếng Anh", oral: "8.0", quiz: "8.5", midterm: "8.7", final: "8.9" },
  { subject: "Khoa học", oral: "8.5", quiz: "8.2", midterm: "8.5", final: "8.7" },
  { subject: "Lịch sử", oral: "9.0", quiz: "8.5", midterm: "8.8", final: "9.0" },
];

export default function TeacherStudentScorePage({ params }: { params: { studentId: string } }) {
  const [rows, setRows] = useState<ScoreRow[]>(defaultRows);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (index: number, key: keyof ScoreRow, value: string) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await teacherService.upsertScores(params.studentId, { scores: rows });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            className="rounded-full border-2 border-pink-200 text-pink-600 hover:bg-pink-100"
          >
            <Link href="/teacher/class">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Nhập điểm học sinh
            </h1>
            <p className="text-sm sm:text-base text-pink-600 mt-1 truncate">Học sinh: {params.studentId}</p>
          </div>
        </div>
        <div className="hidden lg:block">
          <TeacherImages size={70} layout="carousel" />
        </div>
      </motion.div>

      {/* Success Message */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl bg-gradient-to-r from-green-400 to-emerald-400 p-4 text-white shadow-lg"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                <CheckCircle className="h-6 w-6" />
              </motion.div>
              <div>
                <p className="font-bold">Đã lưu thành công!</p>
                <p className="text-sm text-green-50">Bảng điểm đã được cập nhật</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-2 border-pink-200 bg-white shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-t-2xl">
            <CardTitle className="flex items-center gap-2 text-pink-900">
              <Sparkles className="h-5 w-5" />
              Bảng điểm chi tiết
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-pink-100">
                <thead className="bg-gradient-to-r from-pink-100 to-purple-100">
                  <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-pink-900">Môn học</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-pink-900">Miệng</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-pink-900">15 phút</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-pink-900">1 tiết</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-pink-900">Cuối kỳ</th>
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
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm font-semibold text-pink-900">{row.subject}</td>
                      {(["oral", "quiz", "midterm", "final"] as (keyof ScoreRow)[]).map((key) => (
                        <td key={key} className="px-3 sm:px-6 py-3 sm:py-4">
                          <Input
                            type="text"
                            value={row[key]}
                            onChange={(e) => handleChange(idx, key, e.target.value)}
                            className="h-9 sm:h-10 w-16 sm:w-24 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:ring-pink-200 text-sm"
                            placeholder="0.0"
                          />
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end gap-3"
      >
        <Button
          variant="outline"
          asChild
          className="rounded-full border-2 border-pink-200 text-pink-600 hover:bg-pink-50"
        >
          <Link href="/teacher/dashboard">Hủy</Link>
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl"
        >
          {saving ? (
            "Đang lưu..."
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Lưu bảng điểm
            </>
          )}
        </Button>
      </motion.div>

      {/* Judy Decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex justify-center pt-8"
      >
        <div className="text-center">
          <TeacherImages size={72} layout="carousel" className="mx-auto" />
          <p className="text-sm text-pink-600 mt-2 font-medium">
            Chúc bạn chấm điểm vui vẻ! 🎀
          </p>
        </div>
      </motion.div>
    </div>
  );
}
