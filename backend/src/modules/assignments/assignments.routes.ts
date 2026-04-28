import type { FastifyPluginAsync } from "fastify";
import { AppError } from "../../shared/errors/app-error";
import { authMiddleware } from "../auth/auth.middleware";
import { AssignmentsRepository } from "./assignments.repository";
import { classParamsSchema, createAssignmentBodySchema } from "./assignments.schemas";
import { AssignmentsService } from "./assignments.service";

export const assignmentsRoutes: FastifyPluginAsync = async (fastify) => {
  const repository = new AssignmentsRepository(fastify.prisma);
  const service = new AssignmentsService(repository);

  fastify.post("/:classId/assignments", { preHandler: [authMiddleware] }, async (request, reply) => {
    const currentUser = request.authUser;
    if (!currentUser) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }

    const params = classParamsSchema.parse(request.params);
    const body = createAssignmentBodySchema.parse(request.body);
    const assignment = await service.createAssignment(params.classId, body, currentUser);

    return reply.status(201).send({
      success: true,
      data: {
        assignment
      }
    });
  });

  fastify.get("/:classId/assignments", { preHandler: [authMiddleware] }, async (request, reply) => {
    const currentUser = request.authUser;
    if (!currentUser) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }

    const params = classParamsSchema.parse(request.params);
    const assignments = await service.getClassAssignments(params.classId, currentUser);

    return reply.status(200).send({
      success: true,
      data: {
        assignments
      }
    });
  });
};
