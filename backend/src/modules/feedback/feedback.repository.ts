import type { PrismaClient } from "@prisma/client";
import type { Feedback, SubmissionStatus, UserRole } from "@prisma/client";

export class FeedbackRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findSubmissionWithClass(
    submissionId: string
  ): Promise<{ id: string; schoolId: string; assignment: { classId: string } } | null> {
    return this.prisma.submission.findUnique({
      where: { id: submissionId },
      select: {
        id: true,
        schoolId: true,
        assignment: {
          select: {
            classId: true
          }
        }
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

  async findFeedbackBySubmissionAndTeacher(
    submissionId: string,
    teacherId: string
  ): Promise<Feedback | null> {
    return this.prisma.feedback.findFirst({
      where: {
        submissionId,
        teacherId
      }
    });
  }

  async createFeedback(input: {
    schoolId: string;
    submissionId: string;
    teacherId: string;
    comment?: string;
    markedDone: boolean;
  }): Promise<Feedback> {
    return this.prisma.feedback.create({
      data: {
        schoolId: input.schoolId,
        submissionId: input.submissionId,
        teacherId: input.teacherId,
        comment: input.comment ?? null,
        markedDone: input.markedDone
      }
    });
  }

  async updateFeedback(
    feedbackId: string,
    input: { comment?: string; markedDone: boolean }
  ): Promise<Feedback> {
    return this.prisma.feedback.update({
      where: { id: feedbackId },
      data: {
        comment: input.comment ?? null,
        markedDone: input.markedDone
      }
    });
  }

  async updateSubmissionStatus(submissionId: string, status: SubmissionStatus) {
    return this.prisma.submission.update({
      where: { id: submissionId },
      data: { status },
      select: {
        id: true,
        status: true
      }
    });
  }

  async getSubmissionStatus(submissionId: string): Promise<{ id: string; status: SubmissionStatus } | null> {
    return this.prisma.submission.findUnique({
      where: { id: submissionId },
      select: {
        id: true,
        status: true
      }
    });
  }
}
