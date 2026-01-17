"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  role: "admin" | "teacher" | "parent";
  children: ReactNode;
}

export default function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const currentRole = typeof window !== "undefined" ? localStorage.getItem("role") : null;

    if (!token || currentRole !== role) {
      router.replace(`/${role}/login`);
      return;
    }

    setAllowed(true);
  }, [role, router]);

  if (!allowed) {
    return <div className="flex min-h-[200px] items-center justify-center text-gray-500">Đang tải trang...</div>;
  }

  return <>{children}</>;
}

