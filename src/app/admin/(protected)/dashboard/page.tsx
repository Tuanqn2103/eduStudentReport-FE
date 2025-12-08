"use client";

import { motion } from "framer-motion";
import { Users, GraduationCap, BookOpen, FileText, TrendingUp, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { adminService } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const mockStats = [
  { label: "Tổng giáo viên", value: 34, icon: Users, color: "from-indigo-500 to-blue-500", change: "+12%" },
  { label: "Tổng học sinh", value: 620, icon: GraduationCap, color: "from-blue-500 to-cyan-500", change: "+8%" },
  { label: "Lớp học", value: 18, icon: BookOpen, color: "from-purple-500 to-pink-500", change: "+2" },
  { label: "Báo cáo tuần", value: 54, icon: FileText, color: "from-green-500 to-emerald-500", change: "+15%" },
];

const mockChartData = [
  { name: "T2", students: 400, teachers: 20 },
  { name: "T3", students: 450, teachers: 25 },
  { name: "T4", students: 500, teachers: 28 },
  { name: "T5", students: 550, teachers: 30 },
  { name: "T6", students: 600, teachers: 32 },
  { name: "T7", students: 620, teachers: 34 },
];

const mockLineData = [
  { name: "Tháng 1", reports: 120 },
  { name: "Tháng 2", reports: 145 },
  { name: "Tháng 3", reports: 180 },
  { name: "Tháng 4", reports: 210 },
  { name: "Tháng 5", reports: 240 },
  { name: "Tháng 6", reports: 280 },
];

export default function AdminDashboardPage() {
  const { data } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminService.getDashboard,
  });

  const recentTeachers =
    data?.recentTeachers ?? [
      { name: "Nguyễn Văn A", phoneNumber: "0901 234 567", subject: "Toán" },
      { name: "Trần Thị B", phoneNumber: "0902 345 678", subject: "Văn" },
      { name: "Lê Thị C", phoneNumber: "0903 456 789", subject: "Anh" },
    ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Tổng quan hệ thống</h1>
        <p className="text-sm sm:text-base text-slate-600">Thống kê và báo cáo tổng hợp</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat, index) => {
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
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</div>
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

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="students" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="teachers" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Báo cáo theo tháng</span>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockLineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="reports"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: "#6366f1", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Teachers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Giáo viên mới thêm gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTeachers.map((teacher, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                      {teacher.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">{teacher.name}</p>
                      <p className="text-xs sm:text-sm text-slate-500 truncate">{teacher.phoneNumber}</p>
                    </div>
                  </div>
                  <span className="px-2 sm:px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-medium flex-shrink-0">
                    {teacher.subject}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
