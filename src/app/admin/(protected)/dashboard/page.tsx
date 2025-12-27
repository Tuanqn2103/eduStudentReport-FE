"use client";

import { motion } from "framer-motion";
import { Users, GraduationCap, BookOpen, FileText, TrendingUp, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { dashboardService } from "@/services/admin/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: dashboardService.getStats
  });

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Spin size="large" /></div>;
  }
  const stats = [
    {
      label: "Tổng giáo viên",
      value: data?.teacherCount || 0,
      icon: Users,
      color: "from-indigo-500 to-blue-500",
    },
    {
      label: "Tổng học sinh",
      value: data?.studentCount || 0,
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Lớp học",
      value: data?.classCount || 0,
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Báo cáo tuần",
      value: 54,
      icon: FileText,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Tổng quan hệ thống</h1>
        <p className="text-sm sm:text-base text-slate-600">Thống kê và báo cáo tổng hợp</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">{stat.label}</CardTitle>
                  <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-2`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Tăng trưởng hệ thống (Tháng)</span>
                <ArrowUpRight className="h-5 w-5 text-indigo-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.chartData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="students" name="Học sinh mới" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
                    <Bar dataKey="teachers" name="Giáo viên mới" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg h-full">
            <CardHeader>
              <CardTitle>Giáo viên mới gia nhập</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.recentTeachers && data.recentTeachers.length > 0 ? (
                  data.recentTeachers.map((teacher, index) => (
                    <div key={teacher.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                          index % 2 === 0 ? 'bg-gradient-to-br from-blue-500 to-indigo-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'
                        }`}>
                          {teacher.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{teacher.fullName}</p>
                          <p className="text-xs text-slate-500">{teacher.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Mới
                        </span>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(teacher.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-10">Chưa có giáo viên mới trong tháng này</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}