import type { FastifyPluginAsync } from "fastify";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

export const usersRoutes: FastifyPluginAsync = async (fastify) => {
  const repository = new UsersRepository(fastify.prisma);
  const service = new UsersService(repository);
  void service;
};
