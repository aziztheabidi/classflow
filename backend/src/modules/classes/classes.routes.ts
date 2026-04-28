import type { FastifyPluginAsync } from "fastify";
import { AppError } from "../../shared/errors/app-error";
import { authMiddleware } from "../auth/auth.middleware";
import { ClassesRepository } from "./classes.repository";
import { createClassBodySchema, joinClassBodySchema } from "./classes.schemas";
import { ClassesService } from "./classes.service";

export const classesRoutes: FastifyPluginAsync = async (fastify) => {
  const repository = new ClassesRepository(fastify.prisma);
  const service = new ClassesService(repository);

  fastify.post("/", { preHandler: [authMiddleware] }, async (request, reply) => {
    const currentUser = request.authUser;
    if (!currentUser) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }

    const body = createClassBodySchema.parse(request.body);
    const createdClass = await service.createClass(body, currentUser);

    return reply.status(201).send({
      success: true,
      data: {
        class: createdClass
      }
    });
  });

  fastify.post("/join", { preHandler: [authMiddleware] }, async (request, reply) => {
    const currentUser = request.authUser;
    if (!currentUser) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }

    const body = joinClassBodySchema.parse(request.body);
    const joinedClass = await service.joinClass(body, currentUser);

    return reply.status(200).send({
      success: true,
      data: {
        class: joinedClass
      }
    });
  });

  fastify.get("/my", { preHandler: [authMiddleware] }, async (request, reply) => {
    const currentUser = request.authUser;
    if (!currentUser) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }

    const classes = await service.getMyClasses(currentUser);
    return reply.status(200).send({
      success: true,
      data: {
        classes
      }
    });
  });
};
