import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../config";

export const jwtPlugin = fp(async (fastify) => {
  await fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET
  });

  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        await request.jwtVerify();
      } catch {
        reply.status(401).send({
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required"
          }
        });
      }
    }
  );
});
