import type { Post } from "@prisma/client";
import { AppError } from "../../shared/errors/app-error";
import type { AuthenticatedUser } from "../auth/auth.middleware";
import { PostsRepository } from "./posts.repository";
import type { ClassFeedQuery, CreateClassPostBody } from "./posts.schemas";

type PostResponse = Pick<
  Post,
  "id" | "schoolId" | "classId" | "type" | "contentText" | "contentFileUrl" | "contentAudioUrl" | "createdAt"
>;

export class PostsService {
  constructor(private readonly repository: PostsRepository) {}

  async createClassPost(
    classId: string,
    input: CreateClassPostBody,
    currentUser: AuthenticatedUser
  ): Promise<PostResponse> {
    const member = await this.repository.findClassMember(classId, currentUser.userId);
    if (!member) {
      throw new AppError("You are not a member of this class", 403, "FORBIDDEN");
    }

    const classEntity = await this.repository.findClassById(classId);
    if (!classEntity) {
      throw new AppError("Class not found", 404, "CLASS_NOT_FOUND");
    }

    const createdPost = await this.repository.createPost({
      schoolId: classEntity.schoolId,
      classId,
      createdById: currentUser.userId,
      contentText: input.contentText,
      contentFileUrl: input.contentFileUrl,
      contentAudioUrl: input.contentAudioUrl
    });

    return {
      id: createdPost.id,
      schoolId: createdPost.schoolId,
      classId: createdPost.classId,
      type: createdPost.type,
      contentText: createdPost.contentText,
      contentFileUrl: createdPost.contentFileUrl,
      contentAudioUrl: createdPost.contentAudioUrl,
      createdAt: createdPost.createdAt
    };
  }

  async getClassFeed(classId: string, query: ClassFeedQuery, currentUser: AuthenticatedUser) {
    const member = await this.repository.findClassMember(classId, currentUser.userId);
    if (!member) {
      throw new AppError("You are not a member of this class", 403, "FORBIDDEN");
    }

    const posts = await this.repository.getClassFeed({
      classId,
      limit: query.limit,
      cursor: query.cursor
    });

    const nextCursor = posts.length === query.limit ? posts[posts.length - 1]?.id : null;

    return {
      items: posts.map((post) => ({
        id: post.id,
        type: post.type,
        contentText: post.contentText,
        contentFileUrl: post.contentFileUrl,
        contentAudioUrl: post.contentAudioUrl,
        createdAt: post.createdAt,
        creator: {
          name: post.createdBy.name,
          role: post.createdBy.role
        },
        assignment: post.type === "ASSIGNMENT" ? post.assignment : null
      })),
      page: {
        limit: query.limit,
        nextCursor
      }
    };
  }
}
