import { apiRequest } from "./client";

export type SchoolItem = {
  id: string;
  name: string;
  createdById: string;
  createdAt: string;
};

export async function createSchool(token: string, input: { name: string }) {
  return apiRequest<{ school: SchoolItem }>("/schools", {
    method: "POST",
    token,
    body: input
  });
}

export async function getMySchools(token: string) {
  return apiRequest<{ schools: SchoolItem[] }>("/schools/my", {
    token
  });
}
