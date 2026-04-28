import Fastify, { type FastifyInstance } from "fastify";
import { env } from "./config";
import { jwtPlugin } from "./plugins/jwt";
import { prismaPlugin } from "./plugins/prisma";
import { assignmentsModule } from "./modules/assignments";
import { authModule } from "./modules/auth";
import { classesModule } from "./modules/classes";
import { feedbackModule } from "./modules/feedback";
import { postsModule } from "./modules/posts";
import { schoolsModule } from "./modules/schools";
import { submissionsModule } from "./modules/submissions";
import { usersModule } from "./modules/users";
import { globalErrorHandler } from "./shared/errors/error-handler";

type BuildAppOptions = {
  registerPrisma?: boolean;
};

export function buildApp(options: BuildAppOptions = {}): FastifyInstance {
  const app = Fastify({
    logger: env.NODE_ENV !== "test"
  });

  const { registerPrisma = true } = options;

  app.setErrorHandler(globalErrorHandler);

  if (registerPrisma) {
    app.register(prismaPlugin);
  }
  app.register(jwtPlugin);

  app.get("/health", async () => {
    return {
      success: true,
      data: {
        message: "OK",
        timestamp: new Date().toISOString()
      }
    };
  });

  if (registerPrisma) {
    app.register(authModule, { prefix: "/auth" });
    app.register(usersModule, { prefix: "/users" });
    app.register(schoolsModule, { prefix: "/schools" });
    app.register(classesModule, { prefix: "/classes" });
    app.register(postsModule, { prefix: "/classes" });
    app.register(assignmentsModule, { prefix: "/classes" });
    app.register(submissionsModule, { prefix: "/assignments" });
    app.register(feedbackModule, { prefix: "/submissions" });
  }

  return app;
}
