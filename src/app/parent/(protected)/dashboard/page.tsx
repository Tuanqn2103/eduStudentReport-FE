"use client";

import { useQuery } from "@tanstack/react-query";
import { parentService } from "@/services/parent/parent.service";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { User, BookOpen, ChevronRight } from "lucide-react";
import { Child } from "@/types/parent.types";

export default function ParentDashboardPage() {
  const router = useRouter();
  
  const { data: children, isLoading } = useQuery({
    queryKey: ["parent-children"],
    queryFn: parentService.getMyChildren,
  });

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Spin size="large" /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Thông tin học tập</h1>
        <p className="text-gray-500">Vui lòng chọn hồ sơ học sinh để xem chi tiết</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {children?.map((child: Child) => (
          <Card 
            key={child.id}
            className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-blue-500 bg-white"
            onClick={() => router.push(`/parent/children/${child.id}`)}
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                  {child.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{child.fullName}</h3>
                  <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <BookOpen size={14} /> 
                    <span>Lớp {child.className || "Chưa phân lớp"}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-mono bg-slate-100 px-2 py-0.5 rounded w-fit">
                    MSHS: {child.studentCode}
                  </div>
                </div>
              </div>
              <ChevronRight className="text-slate-300" />
            </div>
          </Card>
        ))}
      </div>

      {children?.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          Chưa tìm thấy hồ sơ học sinh nào liên kết với số điện thoại này.
        </div>
      )}
    </div>
  );
}