"use client";

import { motion } from "framer-motion";
import { Users, GraduationCap, BookOpen, FileText, TrendingUp, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { dashboardService } from "@/services/admin/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const mockChartData = [
  { name: "T2", students: 400, teachers: 20 },
  { name: "T3", students: 450, teachers: 25 },
];

const recentTeachers = [
  { name: "Nguyễn Văn A", phoneNumber: "0901 234 567", subject: "Toán" },
  { name: "Trần Thị B", phoneNumber: "0902 345 678", subject: "Văn" },
];

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
      change: "+12%" 
    },
    { 
      label: "Tổng học sinh", 
      value: data?.studentCount || 0, 
      icon: GraduationCap, 
      color: "from-blue-500 to-cyan-500", 
      change: "+8%" 
    },
    { 
      label: "Lớp học", 
      value: data?.classCount || 0, 
      icon: BookOpen, 
      color: "from-purple-500 to-pink-500", 
      change: "+2" 
    },
    { 
      label: "Báo cáo tuần", 
      value: 54, 
      icon: FileText, 
      color: "from-green-500 to-emerald-500", 
      change: "+15%" 
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
                  <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{stat.change}</span>
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
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Tăng trưởng hệ thống</span>
                <ArrowUpRight className="h-5 w-5 text-indigo-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#6366f1" radius={[8, 8, 0, 0]} name="Học sinh" />
                  <Bar dataKey="teachers" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Giáo viên" />
                </BarChart>
              </ResponsiveContainer>
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
              <CardTitle>Giáo viên tiêu biểu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTeachers.map((teacher, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {teacher.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{teacher.name}</p>
                        <p className="text-xs text-slate-500">{teacher.phoneNumber}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {teacher.subject}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}