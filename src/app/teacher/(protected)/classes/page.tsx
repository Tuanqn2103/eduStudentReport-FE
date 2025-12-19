"use client";

import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { teacherService } from "@/services/teacher/teacher.service";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { BookOpen, Calendar, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MyClass } from "@/types/teacher.types";
import Link from "next/link";
import { motion } from "framer-motion";

const CARD_COLORS = [
  "bg-pink-50",
  "bg-purple-50",
  "bg-rose-50",
  "bg-fuchsia-50",
  "bg-indigo-50"
];

export default function TeacherClassesPage() {
  const router = useRouter();

  const { data: classes, isLoading } = useQuery({
    queryKey: ["teacher-classes"],
    queryFn: teacherService.getMyClasses,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <PageContainer title="Lớp Chủ Nhiệm" subtitle="Danh sách các lớp bạn được phân công quản lý">
      {(!classes || classes.length === 0) ? (
        <div className="text-center py-20 bg-pink-50 rounded-xl border-2 border-dashed border-pink-200 text-pink-500">
          <p className="text-pink-600 font-semibold">Bạn chưa được phân công lớp nào.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {classes.map((cls: MyClass, index: number) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
            >
              <Card
                onClick={() => router.push(`/teacher/classes/${cls.id}`)}
                className={`cursor-pointer border-2 border-pink-200 shadow-lg hover:shadow-xl transition-all
          ${CARD_COLORS[index % CARD_COLORS.length]}
          w-[255px] h-[190px] flex flex-col`}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-2xl font-bold text-pink-900 leading-none">
                      {cls.className}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 text-white shadow-md">
                        <BookOpen size={14} />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-4 pt-1 pb-4 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center text-pink-700 text-sm mb-1">
                      <Calendar size={13} className="mr-2" />
                      <span className="font-semibold">Niên khóa: {cls.schoolYear}</span>
                    </div>

                    {typeof cls.studentCount === "number" && (
                      <div className="text-xs text-pink-600">
                        {cls.studentCount} học sinh
                      </div>
                    )}
                  </div>

                  <Button
                    asChild
                    className="mt-2 w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm h-8"
                  >
                    <Link href={`/teacher/classes/${cls.id}`}>Xem chi tiết</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}