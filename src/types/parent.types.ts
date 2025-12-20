export interface TeacherInfo {
  fullName: string;
  phoneNumber: string;
}

export interface Child {
  id: string;
  fullName: string;
  studentCode: string;
  className: string | null;
  schoolYear: string | null;
  homeroomTeachers: TeacherInfo[];
}

export interface ReportSummary {
  id: string;
  term: string;
  isViewed: boolean;
  createdAt: string;
}

export interface Grade {
  subject: string;
  score: number;
  comment?: string;
}

export interface ReportDetail {
  id: string;
  studentId: string;
  classId: string;
  term: string;
  grades: Grade[];
  generalComment?: string;
  isPublished: boolean;
  isViewed: boolean;
  student: {
    fullName: string;
    studentCode: string;
  };
  class: {
    className: string;
    schoolYear: string;
  };
}