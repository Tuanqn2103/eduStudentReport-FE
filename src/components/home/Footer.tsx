import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>

              <div>
                <h4 className="font-bold text-white">TH Phổ Văn</h4>
                <p className="text-sm">Sổ Liên Lạc Điện Tử</p>
              </div>
            </div>

            <p className="text-sm text-gray-400">
              Kết nối Nhà trường và Phụ huynh, cùng nhau đồng hành phát triển.
            </p>
          </div>

          {/* Links */}
          <div>
            <h5 className="font-semibold text-white mb-4">Liên kết</h5>

            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/parent/login" className="hover:text-blue-400 transition-colors">
                  Đăng nhập Phụ huynh
                </Link>
              </li>

              <li>
                <Link href="/teacher/login" className="hover:text-blue-400 transition-colors">
                  Đăng nhập Giáo viên
                </Link>
              </li>

              <li>
                <Link href="/admin/login" className="hover:text-blue-400 transition-colors">
                  Quản trị
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-semibold text-white mb-4">Liên hệ</h5>

            <ul className="space-y-2 text-sm">
              <li>Điện thoại: (024) 1234 5678</li>
              <li>Email: phovan@edu.vn</li>
              <li>Địa chỉ: Phổ Văn, Đức Thọ, Hà Tĩnh</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; 2025 Trường Tiểu Học Phổ Văn. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
