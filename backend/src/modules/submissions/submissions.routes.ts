import type { FastifyPluginAsync } from "fastify";
import { AppError } from "../../shared/errors/app-error";
import { authMiddleware } from "../auth/auth.middleware";
import { SubmissionsRepository } from "./submissions.repository";
import { assignmentParamsSchema, createSubmissionBodySchema } from "./submissions.schemas";
import { SubmissionsService } from "./submissions.service";

export const submissionsRoutes: FastifyPluginAsync = async (fastify) => {
  const repository = new SubmissionsRepository(fastify.prisma);
  const service = new SubmissionsService(repository);

  fastify.post("/:assignmentId/submissions", { preHandler: [authMiddleware] }, async (request, reply) => {
    const currentUser = request.authUser;
    if (!currentUser) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }

    const params = assignmentParamsSchema.parse(request.params);
    const body = createSubmissionBodySchema.parse(request.body);
    const submission = await service.submitAssignment(params.assignmentId, body, currentUser);

    return reply.status(201).send({
      success: true,
      data: {
        submission
      }
    });
  });

  fastify.get("/:assignmentId/submissions", { preHandler: [authMiddleware] }, async (request, reply) => {
    const currentUser = request.authUser;
    if (!currentUser) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }

    const params = assignmentParamsSchema.parse(request.params);
    const result = await service.getAssignmentSubmissions(params.assignmentId, currentUser);

    return reply.status(200).send({
      success: true,
      data: result
    });
  });
};
