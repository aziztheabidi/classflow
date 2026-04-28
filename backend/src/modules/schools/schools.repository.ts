import type { PrismaClient } from "@prisma/client";
import type { School } from "@prisma/client";

export class SchoolsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createSchool(input: { name: string; createdById: string }): Promise<School> {
    return this.prisma.school.create({
      data: {
        name: input.name,
        createdById: input.createdById
      }
    });
  }

  async findSchoolsCreatedByUser(createdById: string): Promise<School[]> {
    return this.prisma.school.findMany({
      where: { createdById },
      orderBy: { createdAt: "desc" }
    });
  }
}
