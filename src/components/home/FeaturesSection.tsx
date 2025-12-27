"use client";

import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { FileText, Bell, MessageSquare, Calendar } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      title: "Xem điểm số",
      desc: "Theo dõi điểm số và kết quả học tập theo từng môn học",
      bg: "bg-blue-100 group-hover:bg-blue-200",
    },
    {
      icon: <Bell className="w-6 h-6 text-green-600" />,
      title: "Thông báo ngay",
      desc: "Nhận thông báo khi giáo viên cập nhật điểm mới",
      bg: "bg-green-100 group-hover:bg-green-200",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-orange-600" />,
      title: "Liên hệ giáo viên",
      desc: "Xem thông tin và liên hệ trực tiếp với giáo viên",
      bg: "bg-orange-100 group-hover:bg-orange-200",
    },
    {
      icon: <Calendar className="w-6 h-6 text-purple-600" />,
      title: "Lịch sử báo cáo",
      desc: "Xem lại toàn bộ lịch sử điểm theo thời gian",
      bg: "bg-purple-100 group-hover:bg-purple-200",
    },
  ];

  return (
    <SectionWrapper>
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Tính năng nổi bật</h3>
        <p className="text-gray-600">Mọi thứ bạn cần để theo dõi quá trình học tập của con</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.1 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="h-full"
          >
            <Card className="border-2 hover:shadow-lg group transition-shadow h-full flex flex-col">
              <CardHeader className="flex-1">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors ${item.bg}`}>
                  {item.icon}
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
