import type { FastifyPluginAsync } from "fastify";
import { AppError } from "../../shared/errors/app-error";
import { authMiddleware } from "../auth/auth.middleware";
import { SchoolsRepository } from "./schools.repository";
import { createSchoolBodySchema } from "./schools.schemas";
import { SchoolsService } from "./schools.service";

export const schoolsRoutes: FastifyPluginAsync = async (fastify) => {
  const repository = new SchoolsRepository(fastify.prisma);
  const service = new SchoolsService(repository);

  fastify.post("/", { preHandler: [authMiddleware] }, async (request, reply) => {
    const currentUser = request.authUser;

    if (!currentUser) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }

    const body = createSchoolBodySchema.parse(request.body);
    const school = await service.createSchool(body, currentUser);

    return reply.status(201).send({
      success: true,
      data: {
        school
      }
    });
  });

  fastify.get("/my", { preHandler: [authMiddleware] }, async (request, reply) => {
    const currentUser = request.authUser;

    if (!currentUser) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }

    const schools = await service.getMySchools(currentUser);

    return reply.status(200).send({
      success: true,
      data: {
        schools
      }
    });
  });
};
