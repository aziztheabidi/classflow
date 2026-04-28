import type { PrismaClient } from "@prisma/client";
import type { Assignment, UserRole } from "@prisma/client";

export class AssignmentsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findClassById(classId: string): Promise<{ id: string; schoolId: string } | null> {
    return this.prisma.class.findUnique({
      where: { id: classId },
      select: {
        id: true,
        schoolId: true
      }
    });
  }

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

  async createAssignmentWithPost(input: {
    classId: string;
    schoolId: string;
    createdById: string;
    title: string;
    instructions?: string;
    contentText?: string;
    contentFileUrl?: string;
    contentAudioUrl?: string;
    dueDate?: Date;
  }): Promise<
    Assignment & {
      post: {
        id: string;
        type: "ASSIGNMENT";
        contentText: string | null;
        contentFileUrl: string | null;
        contentAudioUrl: string | null;
        createdAt: Date;
      };
    }
  > {
    return this.prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          schoolId: input.schoolId,
          classId: input.classId,
          createdById: input.createdById,
          type: "ASSIGNMENT",
          contentText: input.contentText ?? null,
          contentFileUrl: input.contentFileUrl ?? null,
          contentAudioUrl: input.contentAudioUrl ?? null
        }
      });

      return tx.assignment.create({
        data: {
          schoolId: input.schoolId,
          classId: input.classId,
          postId: post.id,
          title: input.title,
          instructions: input.instructions ?? null,
          dueDate: input.dueDate ?? null
        },
        include: {
          post: {
            select: {
              id: true,
              type: true,
              contentText: true,
              contentFileUrl: true,
              contentAudioUrl: true,
              createdAt: true
            }
          }
        }
      });
    });
  }

  async getAssignmentsByClassId(classId: string): Promise<
    Array<
      Assignment & {
        post: {
          id: string;
          type: "ASSIGNMENT";
          contentText: string | null;
          contentFileUrl: string | null;
          contentAudioUrl: string | null;
          createdAt: Date;
          createdBy: {
            id: string;
            name: string | null;
            role: UserRole;
          };
        };
      }
    >
  > {
    return this.prisma.assignment.findMany({
      where: { classId },
      include: {
        post: {
          select: {
            id: true,
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
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
}
