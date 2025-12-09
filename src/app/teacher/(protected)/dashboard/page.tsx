"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, FileText, CheckCircle, Sparkles, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { teacherService } from "@/services/teacher.service";
import { useQuery } from "@tanstack/react-query";
import TeacherImages from "@/components/ui/TeacherImages";
import Link from "next/link";

type ClassItem = {
  name: string;
  students: number;
  pendingReports: number;
  color: string;
};

type DashboardResponse = {
  classes?: ClassItem[];
};

const quickStats = [
  { label: "Lớp phụ trách", value: 3, icon: BookOpen, color: "from-pink-400 to-rose-400" },
  { label: "Học sinh", value: 95, icon: Users, color: "from-purple-400 to-pink-400" },
  { label: "Bài cần chấm", value: 12, icon: FileText, color: "from-rose-400 to-pink-400" },
  { label: "Báo cáo đã gửi", value: 28, icon: CheckCircle, color: "from-pink-400 to-purple-400" },
];

const mockClasses: ClassItem[] = [
  { name: "5A1", students: 32, pendingReports: 4, color: "bg-pink-100" },
  { name: "5A2", students: 31, pendingReports: 2, color: "bg-purple-100" },
  { name: "5A3", students: 32, pendingReports: 6, color: "bg-rose-100" },
];

export default function TeacherDashboardPage() {
  const { data } = useQuery<DashboardResponse>({
    queryKey: ["teacher-dashboard"],
    queryFn: async () => {
      const res = await teacherService.getDashboard();
      return res.data as DashboardResponse;
    },
  });

  const classes = data?.classes ?? mockClasses;

  return (
    <div className="space-y-6">
      {/* Hero Banner với Judy */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 p-8 text-white shadow-2xl"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold">Chào mừng trở lại!</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl sm:text-2xl lg:text-3xl font-bold"
            >
              Cùng nhau tạo nên những điều tuyệt vời! 🎀
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base text-pink-100"
            >
              Hôm nay bạn đã sẵn sàng để chấm điểm và động viên học sinh chưa?
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="hidden lg:block"
          >
            <TeacherImages size={90} layout="carousel" className="max-w-[360px]" />
          </motion.div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 h-full w-full opacity-10">
          <div className="absolute top-10 right-20 h-32 w-32 rounded-full bg-white"></div>
          <div className="absolute bottom-10 right-40 h-24 w-24 rounded-full bg-white"></div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <Card className="border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50 shadow-lg hover:shadow-xl transition-all">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-pink-700">{stat.label}</CardTitle>
                  <div className={`rounded-2xl bg-gradient-to-br ${stat.color} p-2 shadow-md`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Classes List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-pink-900">Lớp học của bạn</h2>
          <Button
            asChild
            href="/teacher/class"
            className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 text-sm sm:text-base"
          >
            <Link href="/teacher/class">Xem tất cả</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {classes.map((classItem: ClassItem, index: number) => (
            <motion.div
              key={classItem.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <Card className={`border-2 border-pink-200 ${classItem.color} shadow-lg hover:shadow-xl transition-all`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-pink-900">{classItem.name}</CardTitle>
                    <Heart className="h-5 w-5 text-pink-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-pink-700">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold">{classItem.students} học sinh</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-700">
                    <FileText className="h-4 w-4" />
                    <span className="font-semibold">{classItem.pendingReports} báo cáo cần gửi</span>
                  </div>
                  <Button
                    asChild
                    href={`/teacher/class/${classItem.name}`}
                    className="mt-4 w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                  >
                    <Link href={`/teacher/class/${classItem.name}`}>Xem chi tiết</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-3xl border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 p-6"
      >
        <h3 className="mb-4 text-lg font-bold text-pink-900">Thao tác nhanh</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            href="/teacher/score"
            className="rounded-full bg-white border-2 border-pink-300 text-pink-700 hover:bg-pink-100"
          >
            <Link href="/teacher/score">Nhập điểm mới</Link>
          </Button>
          <Button
            asChild
            href="/teacher/reports"
            className="rounded-full bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            <Link href="/teacher/reports">Xuất báo cáo PDF</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
