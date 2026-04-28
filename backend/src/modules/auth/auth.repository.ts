import type { PrismaClient } from "@prisma/client";
import type { User, UserRole } from "@prisma/client";

export class AuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { phoneNumber }
    });
  }

  async createUser(input: { phoneNumber: string; role: UserRole; name?: string }): Promise<User> {
    return this.prisma.user.create({
      data: {
        phoneNumber: input.phoneNumber,
        role: input.role,
        name: input.name ?? null
      }
    });
  }
}
