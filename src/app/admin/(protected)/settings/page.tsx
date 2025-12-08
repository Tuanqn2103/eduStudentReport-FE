"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { adminService } from "@/services/admin.service";

export default function AdminSettingsPage() {
  const [schoolName, setSchoolName] = useState("Trường Tiểu Học Phổ Văn");
  const [contact, setContact] = useState("(024) 1234 5678");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminService.updateSettings({ schoolName, contact });
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer title="Cấu hình" subtitle="Thiết lập thông tin hệ thống">
      <div className="space-y-4">
        <Input label="Tên trường" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
        <Input label="Hotline" value={contact} onChange={(e) => setContact(e.target.value)} />
        <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
          {saving ? "Đang lưu..." : "Lưu cấu hình"}
        </Button>
      </div>
    </PageContainer>
  );
}

