import type { Class, PrismaClient } from "@prisma/client";
import type { Post, UserRole } from "@prisma/client";

export class PostsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findClassMember(classId: string, userId: string): Promise<{ role: UserRole } | null> {
    return this.prisma.classMember.findUnique({
      where: {
        classId_userId: {
          classId,
          userId
        }
      },
      select: {
        role: true
      }
    });
  }

  async findClassById(classId: string): Promise<Class | null> {
    return this.prisma.class.findUnique({
      where: { id: classId }
    });
  }

  async createPost(input: {
    schoolId: string;
    classId: string;
    createdById: string;
    contentText?: string;
    contentFileUrl?: string;
    contentAudioUrl?: string;
  }): Promise<Post> {
    return this.prisma.post.create({
      data: {
        schoolId: input.schoolId,
        classId: input.classId,
        createdById: input.createdById,
        type: "MESSAGE",
        contentText: input.contentText ?? null,
        contentFileUrl: input.contentFileUrl ?? null,
        contentAudioUrl: input.contentAudioUrl ?? null
      }
    });
  }

  async getClassFeed(input: { classId: string; limit: number; cursor?: string }): Promise<
    Array<
      Pick<Post, "id" | "schoolId" | "classId" | "type" | "contentText" | "contentFileUrl" | "contentAudioUrl" | "createdAt"> & {
        createdBy: {
          id: string;
          name: string | null;
          role: "TEACHER" | "STUDENT";
        };
        assignment: {
          id: string;
          title: string;
          dueDate: Date | null;
        } | null;
      }
    >
  > {
    return this.prisma.post.findMany({
      where: { classId: input.classId },
      take: input.limit,
      skip: input.cursor ? 1 : 0,
      cursor: input.cursor ? { id: input.cursor } : undefined,
      select: {
        id: true,
        schoolId: true,
        classId: true,
        type: true,
        contentText: true,
        contentFileUrl: true,
        contentAudioUrl: true,
        createdAt: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        assignment: {
          select: {
            id: true,
            title: true,
            dueDate: true
          }
        }
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }]
    });
  }
}
