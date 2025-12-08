import ProtectedRoute from "@/components/layout/ProtectedRoute";
import ParentLayout from "@/components/layout/ParentLayout";

export default function ParentProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute role="parent">
      <ParentLayout>{children}</ParentLayout>
    </ProtectedRoute>
  );
}

