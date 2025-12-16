"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, FileText, CheckCircle, Sparkles, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { teacherService } from "@/services/teacher/teacher.service";
import { useQuery } from "@tanstack/react-query";
import TeacherImages from "@/components/ui/TeacherImages";
import Link from "next/link";
import { Skeleton } from "antd";
import { MyClass } from "@/types/teacher.types";

const CARD_COLORS = [
  "bg-pink-100",
  "bg-purple-100",
  "bg-rose-100",
  "bg-fuchsia-100",
  "bg-indigo-100"
];

export default function TeacherDashboardPage() {
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["teacher-stats"],
    queryFn: teacherService.getStats,
    staleTime: 1000 * 60 * 5,
  });

  const { data: classes, isLoading: loadingClasses } = useQuery({
    queryKey: ["teacher-classes"],
    queryFn: teacherService.getMyClasses,
    staleTime: 1000 * 60 * 5,
  });

  const quickStats = [
    { 
      label: "Lớp phụ trách", 
      value: stats?.classCount || 0, 
      icon: BookOpen, 
      color: "from-pink-400 to-rose-400" 
    },
    { 
      label: "Học sinh", 
      value: stats?.studentCount || 0, 
      icon: Users, 
      color: "from-purple-400 to-pink-400" 
    },
    { 
      label: "Bài cần chấm", 
      value: "--", 
      icon: FileText, 
      color: "from-rose-400 to-pink-400" 
    },
    { 
      label: "Báo cáo đã gửi", 
      value: "--", 
      icon: CheckCircle, 
      color: "from-pink-400 to-purple-400" 
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 p-8 text-white shadow-2xl"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold">Chào mừng trở lại!</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              Cùng nhau tạo nên những điều tuyệt vời! 🎀
            </h1>
            <p className="text-sm sm:text-base text-pink-100">
              Hôm nay bạn đã sẵn sàng để chấm điểm và động viên học sinh chưa?
            </p>
          </div>
          <div className="hidden lg:block">
            <TeacherImages size={90} layout="carousel" className="max-w-[360px]" />
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-pink-700">{stat.label}</CardTitle>
                  <div className={`rounded-2xl bg-gradient-to-br ${stat.color} p-2 shadow-md`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingStats ? (
                    <Skeleton.Button active size="large" style={{ width: 50 }} />
                  ) : (
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-pink-900">Lớp học của bạn</h2>
          <Button asChild className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white">
            <Link href="/teacher/classes">Xem tất cả</Link>
          </Button>
        </div>

        {loadingClasses ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-40 border-2 border-gray-100">
                <CardContent className="p-6">
                  <Skeleton active paragraph={{ rows: 2 }} />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : classes && classes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {classes.map((cls: MyClass, index: number) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <Card className={`border-2 border-pink-200 ${CARD_COLORS[index % CARD_COLORS.length]} shadow-lg transition-all`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-pink-900">{cls.className}</CardTitle>
                      <Heart className="h-5 w-5 text-pink-500" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-pink-700">
                      <Users className="h-4 w-4" />
                      <span className="font-semibold">Niên khóa: {cls.schoolYear}</span>
                    </div>
                    <Button
                      asChild
                      className="mt-4 w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    >
                      <Link href={`/teacher/classes/${cls.id}`}>Xem chi tiết</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-pink-50 rounded-xl border-2 border-dashed border-pink-200 text-pink-500">
            Bạn chưa được phân công lớp nào.
          </div>
        )}
      </div>

      {/* Quick Actions (Luôn hiện) */}
      <div className="rounded-3xl border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 p-6">
        <h3 className="mb-4 text-lg font-bold text-pink-900">Thao tác nhanh</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            className="rounded-full bg-white border-2 border-pink-300 text-pink-700 hover:bg-pink-100"
          >
            <Link href="/teacher/classes">Nhập điểm mới</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}