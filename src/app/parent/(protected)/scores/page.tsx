"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Download, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { PDFExportButton } from "@/components/ui/PDFExportButton";
import { Button } from "@/components/ui/Button";
import { parentService } from "@/services/parent.service";
import { useQuery } from "@tanstack/react-query";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

type ScoreRow = {
  subject: string;
  oral: string;
  quiz: string;
  midterm: string;
  final: string;
};

const columns = [
  { key: "subject", title: "Môn học" },
  { key: "oral", title: "Miệng" },
  { key: "quiz", title: "15 phút" },
  { key: "midterm", title: "1 tiết" },
  { key: "final", title: "Cuối kỳ" },
];

const mockScores: ScoreRow[] = [
  { subject: "Toán", oral: "8.5", quiz: "8.0", midterm: "8.2", final: "8.8" },
  { subject: "Tiếng Việt", oral: "9.0", quiz: "8.8", midterm: "9.0", final: "9.2" },
  { subject: "Tiếng Anh", oral: "8.0", quiz: "8.5", midterm: "8.7", final: "8.9" },
  { subject: "Khoa học", oral: "8.5", quiz: "8.2", midterm: "8.5", final: "8.7" },
  { subject: "Lịch sử", oral: "9.0", quiz: "8.5", midterm: "8.8", final: "9.0" },
];

const radarData = [
  { subject: "Toán", score: 8.4, fullMark: 10 },
  { subject: "Tiếng Việt", score: 9.0, fullMark: 10 },
  { subject: "Tiếng Anh", score: 8.5, fullMark: 10 },
  { subject: "Khoa học", score: 8.5, fullMark: 10 },
  { subject: "Lịch sử", score: 8.8, fullMark: 10 },
];

export default function ParentScoresPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { data } = useQuery({
    queryKey: ["parent-scores"],
    queryFn: parentService.getScores,
  });

  const rows: ScoreRow[] = data?.scores ?? mockScores;

  // Calculate average
  const average =
    rows.reduce((sum, row) => {
      const avg =
        (parseFloat(row.oral) +
          parseFloat(row.quiz) +
          parseFloat(row.midterm) +
          parseFloat(row.final)) /
        4;
      return sum + avg;
    }, 0) / rows.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg flex-shrink-0">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">Bảng điểm chi tiết</h1>
            <p className="text-xs sm:text-sm text-slate-600">Kết quả học tập của học sinh</p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Điểm trung bình</p>
                  <p className="text-2xl sm:text-3xl font-bold text-indigo-700 mt-2">{average.toFixed(1)}</p>
                </div>
                <div className="rounded-full bg-indigo-100 p-3">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Số môn học</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-700 mt-2">{rows.length}</p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Xếp loại</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-700 mt-2">
                    {average >= 8.0 ? "Giỏi" : average >= 6.5 ? "Khá" : "Trung bình"}
                  </p>
                </div>
                <div className="rounded-full bg-purple-100 p-3">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts and Table */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Biểu đồ điểm theo môn</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: "#64748b" }} />
                  <Radar
                    name="Điểm"
                    dataKey="score"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* PDF Export Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-blue-50">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="rounded-full bg-indigo-100 p-6 mb-4">
                <Download className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Tải bảng điểm PDF</h3>
              <p className="text-slate-600 text-center mb-6">
                Xuất bảng điểm chi tiết dưới dạng PDF để lưu trữ hoặc in ra
              </p>
              <PDFExportButton
                contentRef={contentRef}
                filename="bang-diem-hoc-sinh"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-lg"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Score Table */}
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Chi tiết điểm số</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table columns={columns as any} data={rows} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
