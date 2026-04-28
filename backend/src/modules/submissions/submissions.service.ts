import { AppError } from "../../shared/errors/app-error";
import type { AuthenticatedUser } from "../auth/auth.middleware";
import { SubmissionsRepository } from "./submissions.repository";
import type { CreateSubmissionBody } from "./submissions.schemas";

export class SubmissionsService {
  constructor(private readonly repository: SubmissionsRepository) {}

  async submitAssignment(
    assignmentId: string,
    input: CreateSubmissionBody,
    currentUser: AuthenticatedUser
  ) {
    if (currentUser.role !== "STUDENT") {
      throw new AppError("Only students can submit assignments", 403, "FORBIDDEN");
    }

    const assignment = await this.repository.findAssignmentById(assignmentId);
    if (!assignment) {
      throw new AppError("Assignment not found", 404, "ASSIGNMENT_NOT_FOUND");
    }

    const membership = await this.repository.findClassMember(assignment.classId, currentUser.userId);
    if (!membership || membership.role !== "STUDENT") {
      throw new AppError("You are not a student member of this class", 403, "FORBIDDEN");
    }

    const existingSubmission = await this.repository.findStudentSubmission(assignmentId, currentUser.userId);
    const submission = existingSubmission
      ? await this.repository.updateSubmission(existingSubmission.id, input)
      : await this.repository.createSubmission({
          schoolId: assignment.schoolId,
          assignmentId,
          studentId: currentUser.userId,
          textSubmission: input.textSubmission,
          fileUrl: input.fileUrl,
          audioUrl: input.audioUrl
        });

    return submission;
  }

  async getAssignmentSubmissions(assignmentId: string, currentUser: AuthenticatedUser) {
    const assignment = await this.repository.findAssignmentById(assignmentId);
    if (!assignment) {
      throw new AppError("Assignment not found", 404, "ASSIGNMENT_NOT_FOUND");
    }

    const membership = await this.repository.findClassMember(assignment.classId, currentUser.userId);
    if (!membership || membership.role !== "TEACHER") {
      throw new AppError("Only teacher class members can view submissions", 403, "FORBIDDEN");
    }

    const [submissions, classStudents] = await Promise.all([
      this.repository.getSubmissionsForAssignment(assignmentId),
      this.repository.getStudentMembersByClassId(assignment.classId)
    ]);

    const submittedByStudentId = new Set(submissions.map((submission) => submission.studentId));
    const pendingStudents = classStudents
      .filter((member) => !submittedByStudentId.has(member.user.id))
      .map((member) => ({
        studentId: member.user.id,
        studentName: member.user.name,
        phoneNumber: member.user.phoneNumber,
        status: "PENDING" as const
      }));

    return {
      submissions: submissions.map((submission) => ({
        id: submission.id,
        assignmentId: submission.assignmentId,
        studentId: submission.studentId,
        studentName: submission.student.name,
        phoneNumber: submission.student.phoneNumber,
        textSubmission: submission.textSubmission,
        fileUrl: submission.fileUrl,
        audioUrl: submission.audioUrl,
        status: submission.status,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt
      })),
      pendingStudents
    };
  }
}
