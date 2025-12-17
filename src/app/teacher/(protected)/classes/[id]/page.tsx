"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { teacherService } from "@/services/teacher/teacher.service";
import { useQuery } from "@tanstack/react-query";
import { Select, Tag, Spin } from "antd";
import { Edit, CheckCircle, Clock, Eye, ArrowLeft } from "lucide-react";
import { StudentInClass } from "@/types/teacher.types";

export default function TeacherClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [term, setTerm] = useState("HK1");

  const { data: students, isLoading } = useQuery({
    queryKey: ["class-students", id, term],
    queryFn: () => teacherService.getClassStudents(id, term)
  });

  const columns = [
    { 
      key: "studentCode", 
      title: "Mã HS", 
      render: (row: StudentInClass) => <span className="font-mono font-medium">{row.studentCode}</span>
    },
    { 
      key: "fullName", 
      title: "Họ và tên", 
      render: (row: StudentInClass) => <span className="font-medium text-slate-900">{row.fullName}</span> 
    },
    { 
      key: "reportStatus", 
      title: "Trạng thái Điểm", 
      render: (row: StudentInClass) => {
        if (row.reportStatus === 'Đã công bố') 
          return <Tag color="green">Đã công bố</Tag>;
        if (row.reportStatus === 'Lưu nháp') 
          return <Tag color="orange">Lưu nháp</Tag>;
        return <Tag color="default">Chưa nhập</Tag>;
      }
    },
    { 
      key: "isParentViewed", 
      title: "Phụ huynh", 
      render: (row: StudentInClass) => row.isParentViewed 
        ? <Tag color="blue" icon={<Eye size={12}/>}>Đã xem</Tag> 
        : <span className="text-gray-400 text-sm">Chưa xem</span>
    },
    {
      key: "actions",
      title: "Thao tác",
      render: (row: StudentInClass) => (
        <Button 
          variant="outline"
          size="sm" 
          className="gap-2"
          onClick={() => router.push(`/teacher/reports/${row.id}?classId=${id}&term=${term}`)}
        >
          <Edit size={14}/> Nhập điểm
        </Button>
      )
    }
  ];

  return (
    <PageContainer title="Danh sách học sinh" subtitle={`Quản lý điểm số - ${term}`}>
      
      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex flex-wrap justify-between items-center gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.push("/teacher/classes")} className="pl-0 gap-1 text-slate-500 hover:text-blue-600">
            <ArrowLeft size={18} /> Quay lại
          </Button>
          <div className="h-6 w-px bg-slate-300 mx-2"></div>
          <span className="font-medium text-slate-700">Chọn kỳ học:</span>
          <Select 
            value={term} 
            onChange={setTerm} 
            style={{ width: 140 }}
            options={[
              { value: 'HK1', label: 'Học kỳ 1' },
              { value: 'HK2', label: 'Học kỳ 2' },
            ]}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20"><Spin size="large"/></div>
      ) : (
        <Table 
          columns={columns} 
          data={students || []} 
          emptyText="Lớp chưa có học sinh nào."
        />
      )}
    </PageContainer>
  );
}