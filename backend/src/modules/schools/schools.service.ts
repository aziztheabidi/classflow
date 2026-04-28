import type { School } from "@prisma/client";
import { AppError } from "../../shared/errors/app-error";
import type { AuthenticatedUser } from "../auth/auth.middleware";
import { SchoolsRepository } from "./schools.repository";
import type { CreateSchoolBody } from "./schools.schemas";

type SchoolResponse = Pick<School, "id" | "name" | "createdById" | "createdAt">;

export class SchoolsService {
  constructor(private readonly repository: SchoolsRepository) {}

  async createSchool(input: CreateSchoolBody, currentUser: AuthenticatedUser): Promise<SchoolResponse> {
    if (currentUser.role !== "TEACHER") {
      throw new AppError("Only teachers can create schools", 403, "FORBIDDEN");
    }

    const school = await this.repository.createSchool({
      name: input.name,
      createdById: currentUser.userId
    });

    return {
      id: school.id,
      name: school.name,
      createdById: school.createdById,
      createdAt: school.createdAt
    };
  }

  async getMySchools(currentUser: AuthenticatedUser): Promise<SchoolResponse[]> {
    const schools = await this.repository.findSchoolsCreatedByUser(currentUser.userId);
    return schools.map((school) => ({
      id: school.id,
      name: school.name,
      createdById: school.createdById,
      createdAt: school.createdAt
    }));
  }
}
