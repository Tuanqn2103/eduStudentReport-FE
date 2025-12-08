import ProtectedRoute from "@/components/layout/ProtectedRoute";
import TeacherLayout from "@/components/layout/TeacherLayout";

export default function TeacherProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute role="teacher">
      <TeacherLayout>{children}</TeacherLayout>
    </ProtectedRoute>
  );
}

