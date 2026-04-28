import type { Class } from "@prisma/client";
import { AppError } from "../../shared/errors/app-error";
import type { AuthenticatedUser } from "../auth/auth.middleware";
import { ClassesRepository } from "./classes.repository";
import type { CreateClassBody, JoinClassBody } from "./classes.schemas";

type ClassResponse = Pick<Class, "id" | "schoolId" | "name" | "teacherId" | "joinCode" | "createdAt">;

type MyClassResponse = {
  classId: string;
  className: string;
  joinCode: string;
  schoolId: string;
  schoolName: string;
  memberRole: "TEACHER" | "STUDENT";
};

const JOIN_CODE_CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export class ClassesService {
  constructor(private readonly repository: ClassesRepository) {}

  async createClass(input: CreateClassBody, currentUser: AuthenticatedUser): Promise<ClassResponse> {
    if (currentUser.role !== "TEACHER") {
      throw new AppError("Only teachers can create classes", 403, "FORBIDDEN");
    }

    const ownsSchool = await this.repository.isSchoolOwnedByTeacher(input.schoolId, currentUser.userId);
    if (!ownsSchool) {
      throw new AppError("You can only create classes in schools you own", 403, "FORBIDDEN");
    }

    const joinCode = await this.generateUniqueJoinCode();

    const createdClass = await this.repository.createClass({
      schoolId: input.schoolId,
      name: input.name,
      teacherId: currentUser.userId,
      joinCode
    });

    await this.repository.addClassMember({
      schoolId: createdClass.schoolId,
      classId: createdClass.id,
      userId: currentUser.userId,
      role: "TEACHER"
    });

    return {
      id: createdClass.id,
      schoolId: createdClass.schoolId,
      name: createdClass.name,
      teacherId: createdClass.teacherId,
      joinCode: createdClass.joinCode,
      createdAt: createdClass.createdAt
    };
  }

  async joinClass(input: JoinClassBody, currentUser: AuthenticatedUser): Promise<ClassResponse> {
    if (currentUser.role !== "STUDENT") {
      throw new AppError("Only students can join classes", 403, "FORBIDDEN");
    }

    const foundClass = await this.repository.findClassByJoinCode(input.joinCode);
    if (!foundClass) {
      throw new AppError("Class not found", 404, "CLASS_NOT_FOUND");
    }

    const existingMembership = await this.repository.findMembership(foundClass.id, currentUser.userId);
    if (!existingMembership) {
      await this.repository.addClassMember({
        schoolId: foundClass.schoolId,
        classId: foundClass.id,
        userId: currentUser.userId,
        role: "STUDENT"
      });
    }

    return {
      id: foundClass.id,
      schoolId: foundClass.schoolId,
      name: foundClass.name,
      teacherId: foundClass.teacherId,
      joinCode: foundClass.joinCode,
      createdAt: foundClass.createdAt
    };
  }

  async getMyClasses(currentUser: AuthenticatedUser): Promise<MyClassResponse[]> {
    const classMembers = await this.repository.getClassMembersByUser(currentUser.userId);
    return classMembers.map((member) => ({
      classId: member.class.id,
      className: member.class.name,
      joinCode: member.class.joinCode,
      schoolId: member.class.school.id,
      schoolName: member.class.school.name,
      memberRole: member.role
    }));
  }

  private async generateUniqueJoinCode(): Promise<string> {
    const maxAttempts = 10;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const joinCode = this.generateJoinCode();
      const isTaken = await this.repository.isJoinCodeTaken(joinCode);
      if (!isTaken) {
        return joinCode;
      }
    }

    throw new AppError("Unable to generate a unique join code", 500, "JOIN_CODE_GENERATION_FAILED");
  }

  private generateJoinCode(): string {
    let result = "";
    for (let index = 0; index < 6; index += 1) {
      const randomIndex = Math.floor(Math.random() * JOIN_CODE_CHARACTERS.length);
      result += JOIN_CODE_CHARACTERS[randomIndex];
    }
    return result;
  }
}
