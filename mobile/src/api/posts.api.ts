import { apiRequest } from "./client";
import type { PaginatedResult } from "../types/api";

export type FeedItem = {
  id: string;
  type: "MESSAGE" | "ASSIGNMENT";
  contentText: string | null;
  contentFileUrl: string | null;
  contentAudioUrl: string | null;
  createdAt: string;
  creator: {
    name: string | null;
    role: "TEACHER" | "STUDENT";
  };
  assignment: {
    id: string;
    title: string;
    dueDate: string | null;
  } | null;
};

export async function getClassFeed(
  token: string,
  classId: string,
  input: { limit?: number; cursor?: string } = {}
) {
  return apiRequest<{ feed: PaginatedResult<FeedItem> }>(`/classes/${classId}/feed`, {
    token,
    query: {
      limit: input.limit,
      cursor: input.cursor
    }
  });
}

export async function createClassPost(
  token: string,
  classId: string,
  input: {
    type: "MESSAGE";
    contentText?: string;
    contentFileUrl?: string;
    contentAudioUrl?: string;
  }
) {
  return apiRequest<{ post: FeedItem }>(`/classes/${classId}/posts`, {
    method: "POST",
    token,
    body: input
  });
}
