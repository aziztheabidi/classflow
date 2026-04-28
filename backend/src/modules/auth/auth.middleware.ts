import type { FastifyReply, FastifyRequest, preHandlerHookHandler } from "fastify";
import { AppError } from "../../shared/errors/app-error";
import type { UserRole } from "../../shared/types/auth";

export type AuthenticatedUser = {
  userId: string;
  role: UserRole;
};

export const authMiddleware: preHandlerHookHandler = async (
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> => {
  const authorization = request.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AppError("Authentication required", 401, "UNAUTHORIZED");
  }

  try {
    await request.jwtVerify<AuthenticatedUser>();
    request.authUser = request.user;
  } catch {
    throw new AppError("Invalid token", 401, "UNAUTHORIZED");
  }
};
