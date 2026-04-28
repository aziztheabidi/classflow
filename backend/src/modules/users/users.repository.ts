import type { PrismaClient } from "@prisma/client";

export class UsersRepository {
  constructor(private readonly prisma: PrismaClient) {
    void this.prisma;
  }
}
