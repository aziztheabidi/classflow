import type { FastifyReply, FastifyRequest, preHandlerHookHandler } from "fastify";
import { AppError } from "../../shared/errors/app-error";
import type { UserRole } from "../../shared/types/auth";
import { authMiddleware } from "./auth.middleware";

export const requireAuth: preHandlerHookHandler = async (request, reply): Promise<void> => {
  await authMiddleware(request, reply);
};

export function requireRole(allowedRoles: UserRole[]): preHandlerHookHandler {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    const user = request.authUser;

    if (!user) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (!allowedRoles.includes(user.role)) {
      throw new AppError("Insufficient permissions", 403, "FORBIDDEN");
    }
  };
}
