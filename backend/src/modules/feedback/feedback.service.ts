import { AppError } from "../../shared/errors/app-error";
import type { AuthenticatedUser } from "../auth/auth.middleware";
import { FeedbackRepository } from "./feedback.repository";
import type { UpsertFeedbackBody } from "./feedback.schemas";

export class FeedbackService {
  constructor(private readonly repository: FeedbackRepository) {}

  async upsertFeedback(
    submissionId: string,
    input: UpsertFeedbackBody,
    currentUser: AuthenticatedUser
  ) {
    const submission = await this.repository.findSubmissionWithClass(submissionId);
    if (!submission) {
      throw new AppError("Submission not found", 404, "SUBMISSION_NOT_FOUND");
    }

    const membership = await this.repository.findClassMember(submission.assignment.classId, currentUser.userId);
    if (!membership || membership.role !== "TEACHER") {
      throw new AppError("Only teacher class members can review submissions", 403, "FORBIDDEN");
    }

    const existingFeedback = await this.repository.findFeedbackBySubmissionAndTeacher(
      submissionId,
      currentUser.userId
    );

    const feedback = existingFeedback
      ? await this.repository.updateFeedback(existingFeedback.id, input)
      : await this.repository.createFeedback({
          schoolId: submission.schoolId,
          submissionId,
          teacherId: currentUser.userId,
          comment: input.comment,
          markedDone: input.markedDone
        });

    const updatedSubmission = input.markedDone
      ? await this.repository.updateSubmissionStatus(submissionId, "REVIEWED")
      : await this.repository.getSubmissionStatus(submissionId);

    if (!updatedSubmission) {
      throw new AppError("Submission not found", 404, "SUBMISSION_NOT_FOUND");
    }

    return {
      feedback,
      submission: updatedSubmission
    };
  }
}
