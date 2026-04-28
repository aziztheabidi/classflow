import { apiRequest } from "./client";

export type ClassItem = {
  id: string;
  schoolId: string;
  name: string;
  teacherId: string;
  joinCode: string;
  createdAt: string;
};

export async function getMyClasses(token: string) {
  return apiRequest<{ classes: Array<{ classId: string; className: string; schoolId: string; schoolName: string; memberRole: string; joinCode: string }> }>("/classes/my", {
    token
  });
}

export async function createClass(token: string, input: { schoolId: string; name: string }) {
  return apiRequest<{ class: ClassItem }>("/classes", {
    method: "POST",
    token,
    body: input
  });
}

export async function joinClass(token: string, input: { joinCode: string }) {
  return apiRequest<{ class: ClassItem }>("/classes/join", {
    method: "POST",
    token,
    body: input
  });
}
