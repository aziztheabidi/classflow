import type { UserRole } from "../types/auth";

export type ClassFeedRouteParams = {
  classId: string;
  className: string;
};

export type AuthStackParamList = {
  Welcome: undefined;
  PhoneLogin: { role: UserRole };
  OtpVerify: {
    role: UserRole;
    phoneNumber: string;
    name?: string;
  };
};

export type TeacherStackParamList = {
  TeacherHome: undefined;
  CreateSchool: undefined;
  CreateClass: undefined;
  CreateAssignment: ClassFeedRouteParams;
  ClassFeed: ClassFeedRouteParams;
  Submissions: {
    assignmentId: string;
    classId: string;
    className: string;
    assignmentTitle?: string;
  };
  ReviewSubmission: {
    submissionId: string;
    studentName: string | null;
    textSubmission: string | null;
    fileUrl: string | null;
    audioUrl: string | null;
    currentStatus: "SUBMITTED" | "REVIEWED";
  };
};

export type StudentStackParamList = {
  StudentHome: undefined;
  JoinClass: undefined;
  ClassFeed: ClassFeedRouteParams;
  SubmitWork: {
    assignmentId: string;
    classId: string;
    className: string;
  };
};
