import { apiRequest } from "./client";

export type SubmissionItem = {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string | null;
  phoneNumber: string;
  textSubmission: string | null;
  fileUrl: string | null;
  audioUrl: string | null;
  status: "SUBMITTED" | "REVIEWED";
  createdAt: string;
  updatedAt: string;
};

export type PendingStudent = {
  studentId: string;
  studentName: string | null;
  phoneNumber: string;
  status: "PENDING";
};

export async function upsertSubmission(
  token: string,
  assignmentId: string,
  input: { textSubmission?: string; fileUrl?: string; audioUrl?: string }
) {
  return apiRequest<{ submission: SubmissionItem }>(`/assignments/${assignmentId}/submissions`, {
    method: "POST",
    token,
    body: input
  });
}

export async function getAssignmentSubmissions(token: string, assignmentId: string) {
  return apiRequest<{ submissions: SubmissionItem[]; pendingStudents: PendingStudent[] }>(
    `/assignments/${assignmentId}/submissions`,
    { token }
  );
}
