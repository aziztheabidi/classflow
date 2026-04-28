import type { FastifyPluginAsync } from "fastify";
import { AppError } from "../../shared/errors/app-error";
import { authMiddleware } from "../auth/auth.middleware";
import { FeedbackRepository } from "./feedback.repository";
import { submissionParamsSchema, upsertFeedbackBodySchema } from "./feedback.schemas";
import { FeedbackService } from "./feedback.service";

export const feedbackRoutes: FastifyPluginAsync = async (fastify) => {
  const repository = new FeedbackRepository(fastify.prisma);
  const service = new FeedbackService(repository);

  fastify.post("/:submissionId/feedback", { preHandler: [authMiddleware] }, async (request, reply) => {
    const currentUser = request.authUser;
    if (!currentUser) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }

    const params = submissionParamsSchema.parse(request.params);
    const body = upsertFeedbackBodySchema.parse(request.body);
    const result = await service.upsertFeedback(params.submissionId, body, currentUser);

    return reply.status(200).send({
      success: true,
      data: result
    });
  });
};
