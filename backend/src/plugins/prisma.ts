import { PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";
import { env } from "../config";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClient =
  globalThis.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["warn", "error"]
  });

if (env.NODE_ENV !== "production") {
  globalThis.prisma = prismaClient;
}

export const prismaPlugin = fp(async (fastify) => {
  if (!fastify.hasDecorator("prisma")) {
    fastify.decorate("prisma", prismaClient);
  }

  await fastify.prisma.$connect();

  fastify.addHook("onClose", async () => {
    await fastify.prisma.$disconnect();
  });
});
