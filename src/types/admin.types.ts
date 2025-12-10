
// --- COMMON ---
export interface ApiResponse<T> {
  message: string;
  data: T;
}

// --- TEACHER ---
export interface Teacher {
  id: string;
  fullName: string;
  phoneNumber: string;
  isActive: boolean;
  managedClassIds: string[];
  managedClasses?: { id: string; className: string; schoolYear: string }[];
}

export interface CreateTeacherPayload {
  fullName: string;
  phoneNumber: string;
  password?: string;
}

export interface UpdateTeacherPayload {
  fullName?: string;
  isActive?: boolean;
  password?: string;
}

// --- CLASS ---
export interface ClassItem {
  id: string;
  className: string;
  schoolYear: string;
  isActive: boolean;
  teacherIds: string[];
  _count?: {
    students: number;
  };
}

export interface CreateClassPayload {
  className: string;
  schoolYear: string;
  teacherId?: string;
}

export interface AssignTeacherPayload {
  classId: string;
  teacherId: string;
}

// --- STUDENT ---
export interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  gender?: string;
  dateOfBirth?: string;
  parentPhones: string[];
  classId: string;
  pin?: string;
}

export interface CreateStudentPayload {
  classId: string;
  fullName: string;
  parentPhones?: string[];
  gender?: string;
  dateOfBirth?: string | Date;
}

export interface ImportStudentPayload {
  classId: string;
  students: {
    fullName: string;
    studentCode?: string;
    parentPhones?: string[];
    gender?: string;
    dateOfBirth?: string | Date;
  }[];
}

export interface UpdateStudentPayload {
  fullName?: string;
  parentPhones?: string[];
  gender?: string;
  dateOfBirth?: string | Date;
  classId?: string;
  studentCode?: string;
}

// --- SUBJECT ---
export interface Subject {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

export interface CreateSubjectPayload {
  name: string;
  code?: string;
}

// --- DASHBOARD ---
export interface DashboardStats {
  teacherCount: number;
  studentCount: number;
  classCount: number;
}