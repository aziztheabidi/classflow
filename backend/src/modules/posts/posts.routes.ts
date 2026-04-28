import type { FastifyPluginAsync } from "fastify";
import { AppError } from "../../shared/errors/app-error";
import { authMiddleware } from "../auth/auth.middleware";
import { PostsRepository } from "./posts.repository";
import { classFeedQuerySchema, classParamsSchema, createClassPostBodySchema } from "./posts.schemas";
import { PostsService } from "./posts.service";

export const postsRoutes: FastifyPluginAsync = async (fastify) => {
  const repository = new PostsRepository(fastify.prisma);
  const service = new PostsService(repository);

  fastify.get("/:classId/feed", { preHandler: [authMiddleware] }, async (request, reply) => {
    const currentUser = request.authUser;
    if (!currentUser) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }

    const params = classParamsSchema.parse(request.params);
    const query = classFeedQuerySchema.parse(request.query);
    const feed = await service.getClassFeed(params.classId, query, currentUser);

    return reply.status(200).send({
      success: true,
      data: {
        feed
      }
    });
  });

  fastify.post("/:classId/posts", { preHandler: [authMiddleware] }, async (request, reply) => {
    const currentUser = request.authUser;
    if (!currentUser) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }

    const params = classParamsSchema.parse(request.params);
    const body = createClassPostBodySchema.parse(request.body);
    const post = await service.createClassPost(params.classId, body, currentUser);

    return reply.status(201).send({
      success: true,
      data: {
        post
      }
    });
  });
};
