import { apiRequest } from "./client";

export type AssignmentItem = {
  id: string;
  schoolId: string;
  classId: string;
  title: string;
  instructions: string | null;
  dueDate: string | null;
  createdAt: string;
};

export async function createAssignment(
  token: string,
  classId: string,
  input: {
    title: string;
    instructions?: string;
    contentText?: string;
    contentFileUrl?: string;
    contentAudioUrl?: string;
    dueDate?: string;
  }
) {
  return apiRequest<{ assignment: AssignmentItem }>(`/classes/${classId}/assignments`, {
    method: "POST",
    token,
    body: input
  });
}

export async function getClassAssignments(token: string, classId: string) {
  return apiRequest<{ assignments: AssignmentItem[] }>(`/classes/${classId}/assignments`, {
    token
  });
}
