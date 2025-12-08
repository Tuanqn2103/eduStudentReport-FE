"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { BookOpen, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

export default function RoleLayout({
  role,
  children,
  navItems,
}: {
  role: "admin" | "teacher" | "parent";
  children: React.ReactNode;
  navItems: NavItem[];
}) {
  const pathname = usePathname();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      window.location.href = `/${role}/login`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-green-500 text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">EduStudentReport</p>
              <h1 className="text-lg font-bold text-gray-900">{role.toUpperCase()} Portal</h1>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700">
            <LogOut className="mr-2 h-4 w-4" /> Thoát
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[220px,1fr]">
        <nav className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 text-xs font-semibold uppercase text-slate-500">Điều hướng</div>
          <div className="space-y-2">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-slate-100",
                    active ? "bg-slate-100 text-blue-700" : "text-slate-700"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <main className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">{children}</main>
      </div>
    </div>
  );
}

