"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Users } from "lucide-react";

export default function CTASection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200">
        <CardContent className="p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Sẵn sàng kết nối với con?
          </h3>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Hãy đăng nhập ngay để theo dõi quá trình học tập và phát triển của con em mình.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/parent/login" className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Đăng nhập Phụ huynh
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
