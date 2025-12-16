
// --- COMMON ---
export interface ApiResponse<T> {
  message: string;
  data: T;
}

// --- DASHBOARD ---
export interface TeacherDashboardStats {
  classCount: number;
  studentCount: number;
}

// --- CLASS ---
export interface MyClass {
  id: string;
  className: string;
  schoolYear: string;
  teacherIds?: string[];
  studentCount?: number;
  [key: string]: any;
}

// --- STUDENT ---
export interface StudentInClass {
  id: string;
  studentCode: string;
  fullName: string;
  reportStatus: 'Đã công bố' | 'Lưu nháp' | 'Chưa nhập';
  isParentViewed: boolean;
}

// --- REPORT & GRADE ---
export interface Grade {
  subject: string;
  score: number;
  comment?: string;
}

export interface StudentReport {
  id?: string;
  studentId: string;
  classId: string;
  term: string;
  grades: Grade[];
  generalComment?: string;
  isPublished: boolean;
  isViewed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  student?: {
    fullName: string;
    studentCode: string;
  };
}

export interface UpsertReportPayload {
  studentId: string;
  classId: string;
  term: string;
  grades: Grade[];
  generalComment?: string;
  isPublished?: boolean;
}

// --- SUBJECT ---
export interface Subject {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}