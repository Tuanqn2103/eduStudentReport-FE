"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { studentService } from "@/services/admin/student.service";
import { classService } from "@/services/admin/class.service";
import { Button, Upload, message, Select, Card, Alert } from "antd";
import { UploadOutlined, FileTextOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Input } from "antd";
const { TextArea } = Input;

export default function ImportStudentPage() {
  const router = useRouter();
  const [classId, setClassId] = useState<string>();
  const [jsonData, setJsonData] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: () => classService.getAll()
  });

  const handleImport = async () => {
    if (!classId) return message.error("Vui lòng chọn lớp học");
    if (!jsonData) return message.error("Vui lòng nhập dữ liệu");

    try {
      setLoading(true);
      const parsedData = JSON.parse(jsonData);
      
      const res: any = await studentService.import({
        classId,
        students: Array.isArray(parsedData) ? parsedData : [parsedData]
      });

      message.success(`Import thành công ${res.exportData.length} học sinh!`);
      console.log("KẾT QUẢ IMPORT (CÓ MÃ PIN):", res.exportData);
      alert("Import thành công! Hãy mở Console (F12) để xem danh sách Mã PIN vừa tạo.");
      
      router.push("/admin/students");
    } catch (error: any) {
      message.error("Lỗi Import: Dữ liệu JSON không hợp lệ hoặc Server lỗi");
    } finally {
      setLoading(false);
    }
  };

  const sampleData = `[
  { "fullName": "Nguyễn Văn A", "parentPhones": ["0912345678"], "gender": "Nam", "dateOfBirth": "2015-01-01" },
  { "fullName": "Trần Thị B", "parentPhones": ["0988777666"], "gender": "Nữ", "dateOfBirth": "2015-05-20" }
]`;

  return (
    <PageContainer title="Import Học Sinh" subtitle="Thêm nhanh nhiều học sinh vào lớp">
      <Card className="max-w-3xl mx-auto">
        <div className="space-y-6">
          <Alert 
            message="Hướng dẫn" 
            description="Chọn lớp học, sau đó dán dữ liệu danh sách học sinh (định dạng JSON) vào ô bên dưới."
            type="info" 
            showIcon 
          />

          <div>
            <label className="font-medium block mb-2">1. Chọn Lớp học:</label>
            <Select 
              placeholder="Chọn lớp..."
              style={{ width: 300 }}
              onChange={setClassId}
              options={classes?.map(c => ({ label: c.className, value: c.id }))}
            />
          </div>

          <div>
            <label className="font-medium block mb-2">2. Dữ liệu học sinh (JSON):</label>
            <TextArea 
              rows={10} 
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              placeholder={sampleData}
              className="font-mono text-sm"
            />
            <div className="text-xs text-gray-500 mt-2">
              * Copy mẫu JSON ở trên và sửa lại thông tin để test.
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="primary" size="large" onClick={handleImport} loading={loading} icon={<UploadOutlined />}>
              Tiến hành Import
            </Button>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}