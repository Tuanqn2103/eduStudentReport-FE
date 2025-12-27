"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/auth.service";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

    const handleLogout = async () => {
    const role = typeof window !== "undefined" ? localStorage.getItem("role") || "parent" : "parent";

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
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex-shrink-0">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold text-slate-900">Bảng điểm học sinh</h1>
              <p className="text-xs text-slate-500">Phụ huynh</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 hover:bg-red-50 hover:text-red-700 text-xs sm:text-sm cursor-pointer"
          >
            <LogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> 
            <span className="hidden sm:inline">Thoát</span>
          </Button>
        </div>
      </motion.header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl px-4 py-8"
      >
        {children}
      </motion.main>
    </div>
  );
}

