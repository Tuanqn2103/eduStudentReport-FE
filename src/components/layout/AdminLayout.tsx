"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Tổng quan", href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Giáo viên", href: "/admin/teachers", icon: <Users className="w-5 h-5" /> },
  { label: "Học sinh", href: "/admin/students", icon: <GraduationCap className="w-5 h-5" /> },
  { label: "Lớp học", href: "/admin/classes", icon: <BookOpen className="w-5 h-5" /> },
  { label: "Cấu hình", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const role = typeof window !== "undefined" ? localStorage.getItem("role") || "admin" : "admin";

    try {
      await authService.logout(role);
    } catch (error) {
      console.error("Lỗi logout server:", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        localStorage.removeItem("userProfile");
      }
      router.push(`/${role}/login`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md shadow-sm"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg"
            >
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
            </motion.div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                Quản trị viên
              </p>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">EduStudentReport</h1>
            </div>
            <div className="sm:hidden">
              <h1 className="text-sm font-bold text-slate-900">Admin</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden sm:flex text-red-600 hover:text-red-700 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" /> Thoát
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed top-[64px] left-0 right-0 z-[60] border-b border-slate-200 bg-white shadow-md"
          >

            <div className="mx-auto max-w-7xl px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start text-red-600 hover:text-red-700 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" /> Thoát
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto grid max-w-7xl gap-4 sm:gap-6 px-4 py-4 sm:py-8 lg:grid-cols-10">
        <motion.nav
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="hidden lg:block lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg"
        >
          <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Điều hướng
          </div>
          <div className="space-y-1">
            {navItems.map((item, index) => {
              const active = pathname.startsWith(item.href);
              return (
                <motion.div
                  key={item.href}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.03 }}
                  whileHover={{ x: 4 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.nav>

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-lg lg:col-span-7"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
