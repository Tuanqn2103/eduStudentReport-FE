"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { parentService } from "@/services/parent/parent.service";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spin, Tag } from "antd";
import { ArrowLeft, Phone, Calendar, FileText, ChevronRight  } from "lucide-react";
import { Child } from "@/types/parent.types";

export default function ChildDetailPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = use(params);
  const router = useRouter();
  
  const { data: children } = useQuery({
    queryKey: ["parent-children"],
    queryFn: parentService.getMyChildren,
  });

  const currentChild = children?.find((c: Child) => c.id === studentId);

  const { data: reports, isLoading } = useQuery({
    queryKey: ["child-reports", studentId],
    queryFn: () => parentService.getChildReports(studentId),
    enabled: !!studentId
  });

  if (isLoading || !currentChild) return <div className="flex justify-center p-20"><Spin size="large"/></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.push("/parent/dashboard")} className="pl-0 gap-2 text-slate-500 hover:text-blue-600">
          <ArrowLeft size={20} /> Quay lại
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{currentChild.fullName}</h1>
          <p className="text-slate-500 text-sm">Lớp {currentChild.className} - {currentChild.schoolYear}</p>
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-100">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          Thông tin Giáo viên chủ nhiệm
        </h3>
        <div className="space-y-3">
          {currentChild.homeroomTeachers.length > 0 ? (
            currentChild.homeroomTeachers.map((t, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-medium text-slate-700">{t.fullName}</span>
                <a className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                  <Phone size={14} /> {t.phoneNumber}
                </a>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 italic">Chưa có thông tin giáo viên.</p>
          )}
        </div>
      </Card>

      <h3 className="font-bold text-lg text-slate-800 mt-8 mb-4">Sổ liên lạc điện tử</h3>
      <div className="grid gap-4">
        {reports?.map((report) => (
          <div 
            key={report.id}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
            onClick={() => router.push(`/parent/reports/${report.id}`)}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <FileText size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">Báo cáo {report.term === 'HK1' ? 'Học kỳ 1' : 'Học kỳ 2'}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Calendar size={12} />
                  <span>Ngày gửi: {new Date(report.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Tag color={report.isViewed ? "blue" : "red"}>
                {report.isViewed ? "Đã xem" : "Mới"}
              </Tag>
              <ChevronRight className="text-gray-400" />
            </div>
          </div>
        ))}

        {reports?.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">Chưa có báo cáo nào được gửi.</p>
          </div>
        )}
      </div>
    </div>
  );
}