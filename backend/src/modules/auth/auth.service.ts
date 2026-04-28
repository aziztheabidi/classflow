import type { FastifyInstance } from "fastify";
import type { User, UserRole } from "@prisma/client";
import { AppError } from "../../shared/errors/app-error";
import { AuthRepository } from "./auth.repository";
import type { SendOtpBody, VerifyOtpBody } from "./auth.schemas";

const MOCK_OTP = "123456";

type VerifyOtpResult = {
  token: string;
  user: User;
};

export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly fastify: FastifyInstance
  ) {}

  async sendOtp(input: SendOtpBody): Promise<{ message: string; otp: string }> {
    void input;
    return {
      message: "OTP sent successfully",
      otp: MOCK_OTP
    };
  }

  async verifyOtp(input: VerifyOtpBody): Promise<VerifyOtpResult> {
    if (input.otp !== MOCK_OTP) {
      throw new AppError("Invalid OTP", 400, "INVALID_OTP");
    }

    const role = input.role as UserRole;
    let user = await this.repository.findByPhoneNumber(input.phoneNumber);

    if (!user) {
      user = await this.repository.createUser({
        phoneNumber: input.phoneNumber,
        role,
        name: input.name
      });
    }

    const token = this.fastify.jwt.sign({
      userId: user.id,
      role: user.role
    });

    return { token, user };
  }

  async getMe(userId: string): Promise<User> {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    return user;
  }
}
