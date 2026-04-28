import type { FastifyPluginAsync } from "fastify";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { authMiddleware } from "./auth.middleware";
import { sendOtpBodySchema, verifyOtpBodySchema } from "./auth.schemas";

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  const repository = new AuthRepository(fastify.prisma);
  const service = new AuthService(repository, fastify);

  fastify.post("/send-otp", async (request, reply) => {
    const body = sendOtpBodySchema.parse(request.body);
    const result = await service.sendOtp(body);
    return reply.status(200).send({
      success: true,
      data: result
    });
  });

  fastify.post("/verify-otp", async (request, reply) => {
    const body = verifyOtpBodySchema.parse(request.body);
    const result = await service.verifyOtp(body);
    return reply.status(200).send({
      success: true,
      data: {
        token: result.token,
        user: result.user
      }
    });
  });

  fastify.get("/me", { preHandler: [authMiddleware] }, async (request, reply) => {
    const currentUser = request.authUser;

    if (!currentUser) {
      return reply.status(401).send({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required"
        }
      });
    }

    const user = await service.getMe(currentUser.userId);
    return reply.status(200).send({
      success: true,
      data: {
        user
      }
    });
  });
};
