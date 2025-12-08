import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GraduationCap, Users, Award } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto">

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6 text-sm font-medium">
          <Award className="w-4 h-4" />
          Kết nối Nhà trường - Phụ huynh
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Theo dõi học tập của con <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
            dễ dàng và nhanh chóng
          </span>
        </h2>

        <p className="text-center text-gray-700 text-lg sm:whitespace-nowrap mb-8">
          Hệ thống sổ liên lạc điện tử giúp phụ huynh cập nhật thông tin học tập của con em mọi lúc, mọi nơi.
        </p>


        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white"
            asChild
          >
            <Link href="/parent/login" className="flex items-center">
              <Users className="w-5 h-5 mr-2" /> Dành cho Phụ huynh
            </Link>
          </Button>

          <Button size="lg" variant="outline" className="border-2" asChild>
            <Link href="/teacher/login" className="flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" /> Dành cho Giáo viên
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}
