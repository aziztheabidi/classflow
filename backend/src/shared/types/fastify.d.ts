import type { PrismaClient } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthenticatedUser } from "../../modules/auth/auth.middleware";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }

  interface FastifyRequest {
    authUser?: AuthenticatedUser;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: AuthenticatedUser;
    user: AuthenticatedUser;
  }
}
