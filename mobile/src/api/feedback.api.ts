import { apiRequest } from "./client";

export async function upsertFeedback(
  token: string,
  submissionId: string,
  input: { comment?: string; markedDone: boolean }
) {
  return apiRequest<{
    feedback: {
      id: string;
      submissionId: string;
      teacherId: string;
      comment: string | null;
      markedDone: boolean;
      createdAt: string;
      updatedAt: string;
    };
    submission: { id: string; status: "SUBMITTED" | "REVIEWED" };
  }>(`/submissions/${submissionId}/feedback`, {
    method: "POST",
    token,
    body: input
  });
}
