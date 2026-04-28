import type { PrismaClient } from "@prisma/client";
import type { Submission } from "@prisma/client";
import type { UserRole } from "@prisma/client";

export class SubmissionsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAssignmentById(assignmentId: string): Promise<{ id: string; classId: string; schoolId: string } | null> {
    return this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: {
        id: true,
        classId: true,
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

  async findStudentSubmission(assignmentId: string, studentId: string): Promise<Submission | null> {
    return this.prisma.submission.findFirst({
      where: {
        assignmentId,
        studentId
      }
    });
  }

  async createSubmission(input: {
    schoolId: string;
    assignmentId: string;
    studentId: string;
    textSubmission?: string;
    fileUrl?: string;
    audioUrl?: string;
  }): Promise<Submission> {
    return this.prisma.submission.create({
      data: {
        schoolId: input.schoolId,
        assignmentId: input.assignmentId,
        studentId: input.studentId,
        textSubmission: input.textSubmission ?? null,
        fileUrl: input.fileUrl ?? null,
        audioUrl: input.audioUrl ?? null,
        status: "SUBMITTED"
      }
    });
  }

  async updateSubmission(
    submissionId: string,
    input: { textSubmission?: string; fileUrl?: string; audioUrl?: string }
  ): Promise<Submission> {
    return this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        textSubmission: input.textSubmission ?? null,
        fileUrl: input.fileUrl ?? null,
        audioUrl: input.audioUrl ?? null,
        status: "SUBMITTED"
      }
    });
  }

  async getSubmissionsForAssignment(assignmentId: string): Promise<
    Array<
      Submission & {
        student: {
          id: string;
          name: string | null;
          phoneNumber: string;
        };
      }
    >
  > {
    return this.prisma.submission.findMany({
      where: { assignmentId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            phoneNumber: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async getStudentMembersByClassId(classId: string): Promise<
    Array<{
      user: {
        id: string;
        name: string | null;
        phoneNumber: string;
      };
    }>
  > {
    return this.prisma.classMember.findMany({
      where: {
        classId,
        role: "STUDENT"
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            phoneNumber: true
          }
        }
      }
    });
  }
}
