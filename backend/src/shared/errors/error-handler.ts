import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { env } from "../../config";
import { AppError } from "./app-error";

export function globalErrorHandler(error: FastifyError, _request: FastifyRequest, reply: FastifyReply): void {
  if (error instanceof AppError) {
    reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message
      }
    });
    return;
  }

  if (error instanceof ZodError) {
    reply.status(400).send({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed"
      }
    });
    return;
  }

  reply.status(500).send({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: env.NODE_ENV === "development" ? error.message : "Unexpected error occurred"
    }
  });
}
