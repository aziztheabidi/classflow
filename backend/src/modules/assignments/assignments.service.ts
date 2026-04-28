import { AppError } from "../../shared/errors/app-error";
import type { AuthenticatedUser } from "../auth/auth.middleware";
import { AssignmentsRepository } from "./assignments.repository";
import type { CreateAssignmentBody } from "./assignments.schemas";

export class AssignmentsService {
  constructor(private readonly repository: AssignmentsRepository) {}

  async createAssignment(
    classId: string,
    input: CreateAssignmentBody,
    currentUser: AuthenticatedUser
  ) {
    const classEntity = await this.repository.findClassById(classId);
    if (!classEntity) {
      throw new AppError("Class not found", 404, "CLASS_NOT_FOUND");
    }

    const member = await this.repository.findClassMember(classId, currentUser.userId);
    if (!member || member.role !== "TEACHER") {
      throw new AppError("Only teacher class members can create assignments", 403, "FORBIDDEN");
    }

    const assignment = await this.repository.createAssignmentWithPost({
      classId,
      schoolId: classEntity.schoolId,
      createdById: currentUser.userId,
      title: input.title,
      instructions: input.instructions,
      contentText: input.contentText,
      contentFileUrl: input.contentFileUrl,
      contentAudioUrl: input.contentAudioUrl,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined
    });

    return {
      id: assignment.id,
      schoolId: assignment.schoolId,
      classId: assignment.classId,
      title: assignment.title,
      instructions: assignment.instructions,
      dueDate: assignment.dueDate,
      createdAt: assignment.createdAt,
      post: assignment.post
    };
  }

  async getClassAssignments(classId: string, currentUser: AuthenticatedUser) {
    const member = await this.repository.findClassMember(classId, currentUser.userId);
    if (!member) {
      throw new AppError("You are not a member of this class", 403, "FORBIDDEN");
    }

    const assignments = await this.repository.getAssignmentsByClassId(classId);
    return assignments.map((assignment) => ({
      id: assignment.id,
      schoolId: assignment.schoolId,
      classId: assignment.classId,
      title: assignment.title,
      instructions: assignment.instructions,
      dueDate: assignment.dueDate,
      createdAt: assignment.createdAt,
      post: {
        id: assignment.post.id,
        type: assignment.post.type,
        contentText: assignment.post.contentText,
        contentFileUrl: assignment.post.contentFileUrl,
        contentAudioUrl: assignment.post.contentAudioUrl,
        createdAt: assignment.post.createdAt,
        creator: {
          id: assignment.post.createdBy.id,
          name: assignment.post.createdBy.name,
          role: assignment.post.createdBy.role
        }
      }
    }));
  }
}
