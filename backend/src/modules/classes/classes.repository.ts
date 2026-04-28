import type { PrismaClient } from "@prisma/client";
import type { Class, ClassMember, UserRole } from "@prisma/client";

export class ClassesRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async isSchoolOwnedByTeacher(schoolId: string, teacherId: string): Promise<boolean> {
    const school = await this.prisma.school.findFirst({
      where: {
        id: schoolId,
        createdById: teacherId
      },
      select: {
        id: true
      }
    });
    return Boolean(school);
  }

  async isJoinCodeTaken(joinCode: string): Promise<boolean> {
    const existing = await this.prisma.class.findUnique({
      where: { joinCode },
      select: { id: true }
    });
    return Boolean(existing);
  }

  async createClass(input: {
    schoolId: string;
    name: string;
    teacherId: string;
    joinCode: string;
  }): Promise<Class> {
    return this.prisma.class.create({
      data: {
        schoolId: input.schoolId,
        name: input.name,
        teacherId: input.teacherId,
        joinCode: input.joinCode
      }
    });
  }

  async addClassMember(input: {
    schoolId: string;
    classId: string;
    userId: string;
    role: UserRole;
  }): Promise<ClassMember> {
    return this.prisma.classMember.create({
      data: {
        schoolId: input.schoolId,
        classId: input.classId,
        userId: input.userId,
        role: input.role
      }
    });
  }

  async findClassByJoinCode(joinCode: string): Promise<Class | null> {
    return this.prisma.class.findUnique({
      where: { joinCode }
    });
  }

  async findMembership(classId: string, userId: string): Promise<ClassMember | null> {
    return this.prisma.classMember.findUnique({
      where: {
        classId_userId: {
          classId,
          userId
        }
      }
    });
  }

  async getClassMembersByUser(userId: string): Promise<
    Array<{
      role: UserRole;
      class: {
        id: string;
        name: string;
        joinCode: string;
        school: {
          id: string;
          name: string;
        };
      };
    }>
  > {
    return this.prisma.classMember.findMany({
      where: { userId },
      select: {
        role: true,
        class: {
          select: {
            id: true,
            name: true,
            joinCode: true,
            school: {
              select: {
                id: true,
                name: true
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
