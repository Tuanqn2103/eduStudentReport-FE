"use client";

import { use, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { parentService } from "@/services/parent/parent.service";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spin } from "antd";
import { ArrowLeft } from "lucide-react";
import { PDFExportButton } from "@/components/ui/PDFExportButton";

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const componentRef = useRef<HTMLDivElement>(null);

  const { data: report, isLoading } = useQuery({
    queryKey: ["report-detail", id],
    queryFn: () => parentService.getReportDetail(id),
  });

  if (isLoading) return <div className="flex justify-center p-20"><Spin size="large"/></div>;
  if (!report) return <div className="text-center p-10">Không tìm thấy báo cáo.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={() => router.back()} className="pl-0 gap-2 text-slate-500">
          <ArrowLeft size={20} /> Quay lại
        </Button>
        <PDFExportButton contentRef={componentRef} filename={`BangDiem_${report.student.fullName}`} />
      </div>

      <div ref={componentRef} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 print:shadow-none print:border-none">
        <div className="text-center border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold text-blue-900 uppercase">Phiếu Báo Kết Quả Học Tập</h2>
          <p className="text-gray-600 mt-2">
            Năm học: <span className="font-semibold">{report.class.schoolYear}</span> - Kỳ: <span className="font-semibold">{report.term}</span>
          </p>
        </div>

        <div className="flex justify-between mb-8 text-sm">
          <div>
            <p className="text-gray-500">Họ và tên:</p>
            <p className="font-bold text-lg text-slate-800">{report.student.fullName}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Lớp:</p>
            <p className="font-bold text-lg text-slate-800">{report.class.className}</p>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 text-gray-700 uppercase font-bold">
              <tr>
                <th className="border p-3 w-1/2">Môn học</th>
                <th className="border p-3 text-center">Điểm số</th>
                <th className="border p-3">Nhận xét chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {report.grades.map((grade, index) => (
                <tr key={index} className="border-b">
                  <td className="border p-3 font-medium text-slate-700">{grade.subject}</td>
                  <td className="border p-3 text-center font-bold text-blue-600 text-lg">{grade.score}</td>
                  <td className="border p-3 text-gray-600">{grade.comment || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-8">
          <h3 className="font-bold text-blue-800 mb-2">Nhận xét của Giáo viên chủ nhiệm:</h3>
          <p className="text-slate-700 italic leading-relaxed">
            "{report.generalComment || "Không có nhận xét."}"
          </p>
        </div>

        <div className="text-center text-xs text-gray-400 mt-10 print:hidden">
          Thông báo này được gửi tự động từ hệ thống Sổ Liên Lạc Điện Tử.
        </div>
      </div>
    </div>
  );
}