import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BookOpen } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-900">Trường Tiểu Học Phổ Văn</h1>
              <p className="text-sm text-gray-600">Sổ Liên Lạc Điện Tử</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
