"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  FileDown, 
  LogOut,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import TeacherImages from "@/components/ui/TeacherImages";
import { authService } from "@/services/auth.service";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/teacher/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Lớp của tôi", href: "/teacher/class", icon: <Users className="w-5 h-5" /> },
  { label: "Nhập điểm", href: "/teacher/score", icon: <FileText className="w-5 h-5" /> },
  { label: "Báo cáo PDF", href: "/teacher/reports", icon: <FileDown className="w-5 h-5" /> },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
    const role = typeof window !== "undefined" ? localStorage.getItem("role") || "teacher" : "teacher";

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b border-pink-200/50 bg-white/80 backdrop-blur-md shadow-sm"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-400 to-purple-400 shadow-lg"
            >
              <TeacherImages size={36} className="sm:w-12 sm:h-12" />
            </motion.div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-pink-500">
                Giáo viên
              </p>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Sổ Liên Lạc Điện Tử
              </h1>
            </div>
            <div className="sm:hidden">
              <h1 className="text-sm font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Giáo viên
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden sm:flex rounded-full border border-pink-200 text-pink-600 hover:bg-pink-100 hover:text-pink-700"
            >
              <LogOut className="mr-2 h-4 w-4" /> Thoát
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-full border border-pink-200 text-pink-600 hover:bg-pink-100"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-pink-200 bg-white/90 backdrop-blur-sm"
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
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                      active
                        ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg shadow-pink-200"
                        : "text-pink-700 hover:bg-pink-100/50"
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
                className="w-full justify-start rounded-full border border-pink-200 text-pink-600 hover:bg-pink-100 hover:text-pink-700"
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
          className="hidden lg:block lg:col-span-3 rounded-3xl border-2 border-pink-200/50 bg-white/60 backdrop-blur-sm p-6 shadow-lg"
        >
          <div className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-pink-500">
            <Sparkles className="w-4 h-4" />
            Điều hướng
          </div>
          <div className="space-y-2">
            {navItems.map((item, index) => {
              const active = pathname.startsWith(item.href);
              return (
                <motion.div
                  key={item.href}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                      active
                        ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg shadow-pink-200"
                        : "text-pink-700 hover:bg-pink-100/50"
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
          className="rounded-3xl border-2 border-pink-200/50 bg-white/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 shadow-lg lg:col-span-7"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
