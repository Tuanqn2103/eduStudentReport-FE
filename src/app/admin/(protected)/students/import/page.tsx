"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as XLSX from "xlsx";
import PageContainer from "@/components/layout/PageContainer";
import { studentService } from "@/services/admin/student.service";
import { classService } from "@/services/admin/class.service";
import { Button, Upload, message, Select, Card, Alert, Table, Tag, Modal } from "antd";
import { InboxOutlined, DownloadOutlined, SaveOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { ImportStudentPayload } from "@/types/admin.types";
import dayjs from "dayjs";

const { Dragger } = Upload;
const { confirm } = Modal;

interface ExcelRow {
  "Họ tên": string;
  "Giới tính": string;
  "Ngày sinh": number | string | Date;
  "Sđt PH": string | number;
  "Mã HS"?: string;
}

interface ParsedStudent {
  key: number;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  parentPhones: string[];
  studentCode?: string;
}

interface ImportResult {
  fullName: string;
  studentCode: string;
  pin: string;
}

export default function ImportStudentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [classId, setClassId] = useState<string | undefined>(searchParams.get("classId") || undefined);
  const [parsedData, setParsedData] = useState<ParsedStudent[]>([]);
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: () => classService.getAll()
  });

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary", cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

        if (jsonData.length === 0) {
          message.error("File Excel không có dữ liệu!");
          return;
        }

        const formattedData: ParsedStudent[] = jsonData.map((row, index) => {
          let formattedDate = "";

          if (row["Ngày sinh"]) {
            if (row["Ngày sinh"] instanceof Date) {
              const date = new Date(row["Ngày sinh"]);
              date.setHours(date.getHours() + 12);
              formattedDate = date.toISOString().split('T')[0];
            } else {
              const parts = String(row["Ngày sinh"]).split('/');
              if (parts.length === 3) {
                formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
              }
            }
          }

          let phoneStr = "";
          if (row["Sđt PH"]) {
            phoneStr = String(row["Sđt PH"]).trim();
            if (!phoneStr.startsWith("0") && phoneStr.length >= 9) {
              phoneStr = "0" + phoneStr;
            }
          }

          return {
            key: index,
            fullName: row["Họ tên"]?.trim() || "",
            gender: row["Giới tính"]?.trim() || "",
            dateOfBirth: formattedDate,
            parentPhones: phoneStr ? [phoneStr] : [],
            studentCode: row["Mã HS"] ? String(row["Mã HS"]).trim() : undefined
          };
        });

        const validData = formattedData.filter(item => item.fullName);
        setParsedData(validData);
        message.success(`Đã đọc thành công ${validData.length} bản ghi hợp lệ!`);
      } catch (error) {
        console.error(error);
        message.error("Lỗi khi đọc file Excel. Vui lòng kiểm tra định dạng.");
      }
    };

    reader.readAsBinaryString(file);
    return false;
  };

  const handleImport = async () => {
    if (!classId) return message.error("Vui lòng chọn lớp học");
    if (parsedData.length === 0) return message.error("Chưa có dữ liệu để import");

    try {
      setLoading(true);

      const payload: ImportStudentPayload = {
        classId,
        students: parsedData.map(item => ({
          fullName: item.fullName,
          gender: item.gender,
          dateOfBirth: item.dateOfBirth ? new Date(item.dateOfBirth) : undefined,
          parentPhones: item.parentPhones,
          studentCode: item.studentCode
        }))
      };

      const res: any = await studentService.import(payload);

      if (res && res.exportData) {
        message.success(`Đã import thành công ${res.exportData.length} học sinh!`);
        setImportResults(res.exportData);
        setParsedData([]);
        setHasDownloaded(false);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err?.response?.data?.message || "Lỗi Import dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const exportResultToExcel = () => {
    const exportData = importResults.map(item => ({
      "Mã Học Sinh": item.studentCode,
      "Họ và Tên": item.fullName,
      "Mã PIN (Mật khẩu)": item.pin
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSach_TaiKhoan");
    XLSX.writeFile(wb, "DanhSach_TaiKhoan_HocSinh.xlsx");
    setHasDownloaded(true);
  };

  const handleSafeNavigation = (action: () => void) => {
    if (hasDownloaded) {
      action();
    } else {
      confirm({
        title: 'Cảnh báo quan trọng!',
        icon: <ExclamationCircleOutlined className="text-red-500" />,
        content: 'Bạn CHƯA tải danh sách mã PIN về máy. Nếu rời đi bây giờ, bạn sẽ mất toàn bộ mã PIN này và phải cấp lại thủ công từng cái.',
        okText: 'Tôi hiểu, vẫn rời đi',
        okType: 'danger',
        cancelText: 'Ở lại để tải',
        onOk() {
          action();
        },
      });
    }
  };

  const downloadTemplate = () => {
    const headers = [
      { "Họ tên": "Nguyễn Văn A", "Sđt PH": "0912345678", "Giới tính": "Nam", "Ngày sinh": "27/04/2018", "Mã HS": "" },
      { "Họ tên": "Trần Thị B", "Sđt PH": "0988777666", "Giới tính": "Nữ", "Ngày sinh": "15/05/2018", "Mã HS": "" }
    ];
    const ws = XLSX.utils.json_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mau_Import");
    XLSX.writeFile(wb, "Mau_Import_Hoc_Sinh.xlsx");
  };

  const previewColumns = [
    { title: "Họ và tên", dataIndex: "fullName", key: "fullName" },
    { title: "Giới tính", dataIndex: "gender", key: "gender" },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (date: string) => date ? dayjs(date).format("DD/MM/YYYY") : <span className="text-red-500">Lỗi format</span>
    },
    {
      title: "SĐT Phụ huynh",
      dataIndex: "parentPhones",
      key: "parentPhones",
      render: (phones: string[]) => phones.map(p => <Tag key={p}>{p}</Tag>)
    },
    { title: "Mã HS", dataIndex: "studentCode", key: "studentCode", render: (text: string) => text || <span className="text-gray-400">Tự sinh</span> }
  ];

  const resultColumns = [
    { title: "Mã HS", dataIndex: "studentCode", key: "studentCode" },
    { title: "Họ và tên", dataIndex: "fullName", key: "fullName" },
    {
      title: "Mã PIN (Quan trọng)",
      dataIndex: "pin",
      key: "pin",
      render: (pin: string) => <Tag color="volcano" className="text-lg font-bold px-3 py-1 font-mono tracking-wider">{pin}</Tag>
    }
  ];

  if (importResults.length > 0) {
    const resultColumns = [
      {
        title: "Mã HS",
        dataIndex: "studentCode",
        key: "studentCode",
        width: 150,
        render: (text: string) => <span className="font-semibold text-blue-700">{text}</span>
      },
      {
        title: "Họ và tên",
        dataIndex: "fullName",
        key: "fullName",
        render: (text: string) => <span className="font-medium">{text}</span>
      },
      {
        title: "Mã PIN (Mật khẩu)",
        dataIndex: "pin",
        key: "pin",
        width: 200,
        align: "center" as const,
        render: (pin: string) => (
          <div className="bg-slate-100 border border-slate-300 rounded px-3 py-1 inline-block font-mono text-lg font-bold tracking-widest text-slate-800">
            {pin}
          </div>
        )
      }
    ];

    return (
      <PageContainer title="Kết quả Import" subtitle="Danh sách tài khoản vừa khởi tạo">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <SaveOutlined className="text-2xl text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-800">Import thành công!</h3>
                <p className="text-green-700 text-sm mt-1 max-w-xl">
                  Đã tạo xong <b>{importResults.length}</b> hồ sơ. Vui lòng tải file Excel chứa Mã PIN bên dưới và gửi cho giáo viên chủ nhiệm.
                </p>
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              icon={<DownloadOutlined />}
              onClick={exportResultToExcel}
              className={`font-semibold h-12 px-6 shadow-md transition-all ${
                hasDownloaded 
                  ? "bg-gray-500 hover:bg-gray-600 border-gray-500 opacity-80"
                  : "bg-green-600 hover:bg-green-700 border-none animate-pulse"
              }`}
            >
              {hasDownloaded ? "Đã tải xong (Tải lại)" : "Tải danh sách PIN (.xlsx)"}
            </Button>
          </div>

          <Card className="shadow-md border-0" bodyStyle={{ padding: 0 }}>
            <Table
              dataSource={importResults}
              columns={resultColumns}
              pagination={false}
              rowKey="studentCode"
              scroll={{ y: 500 }}
              className="custom-table"
            />
          </Card>

          <div className="flex justify-end gap-4">
            <Button size="large" onClick={() => { setImportResults([]); router.push("/admin/students"); }} disabled={!hasDownloaded}>
              Về danh sách học sinh
            </Button>
            <Button size="large" type="dashed" onClick={() => setImportResults([])} disabled={!hasDownloaded}>
              Tiếp tục Import khác
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Import Học Sinh (Excel)" subtitle="Thêm nhanh nhiều học sinh vào lớp từ file Excel">
      <Card className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <Alert
            message="Quy định file Excel"
            description={
              <ul className="list-disc pl-4 mt-2 text-sm">
                <li>Tên cột bắt buộc: <b>Họ tên</b>, <b>Sđt PH</b>, <b>Giới tính</b>, <b>Ngày sinh</b>.</li>
                <li>Ngày sinh nên định dạng <b>dd/mm/yyyy</b> hoặc Text.</li>
                <li>Tải file mẫu bên dưới để nhập liệu chính xác nhất.</li>
              </ul>
            }
            type="info"
            showIcon
          />

          <div className="flex flex-col md:flex-row gap-4 justify-between items-end">
            <div className="w-full md:w-1/2">
              <label className="font-medium block mb-2">1. Chọn Lớp học:</label>
              <Select
                placeholder="Chọn lớp..."
                className="w-full"
                value={classId}
                size="large"
                onChange={setClassId}
                options={classes?.map(c => ({ label: `${c.className} (${c.schoolYear})`, value: c.id }))}
              />
            </div>

            <Button icon={<DownloadOutlined />} onClick={downloadTemplate}>
              Tải file mẫu Excel
            </Button>
          </div>

          <div>
            <label className="font-medium block mb-2">2. Upload file Excel:</label>
            <Dragger
              name="file"
              multiple={false}
              accept=".xlsx, .xls"
              beforeUpload={handleFileUpload}
              showUploadList={false}
              className="bg-gray-50 border-dashed border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="text-blue-500 text-4xl" />
              </p>
              <p className="ant-upload-text text-lg font-medium text-gray-700">
                Kéo thả file vào đây hoặc bấm để chọn file
              </p>
              <p className="ant-upload-hint text-gray-500">
                Hỗ trợ định dạng .xlsx, .xls
              </p>
            </Dragger>
          </div>

          {parsedData.length > 0 && (
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800">3. Xem trước dữ liệu ({parsedData.length} bản ghi)</h3>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleImport}
                  loading={loading}
                  icon={<SaveOutlined />}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Xác nhận Import
                </Button>
              </div>
              <Table
                dataSource={parsedData}
                columns={previewColumns}
                pagination={{ pageSize: 10 }}
                size="small"
                bordered
              />
            </div>
          )}
        </div>
      </Card>
    </PageContainer>
  );
}