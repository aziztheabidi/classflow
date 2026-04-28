import { apiRequest } from "./client";
import type { AuthUser, UserRole } from "../types/auth";

export type SendOtpInput = {
  phoneNumber: string;
  role: UserRole;
  name?: string;
};

export type VerifyOtpInput = SendOtpInput & {
  otp: string;
};

export async function sendOtp(input: SendOtpInput) {
  return apiRequest<{ message: string; otp: string }>("/auth/send-otp", {
    method: "POST",
    body: input
  });
}

export async function verifyOtp(input: VerifyOtpInput) {
  return apiRequest<{ token: string; user: AuthUser }>("/auth/verify-otp", {
    method: "POST",
    body: input
  });
}

export async function getMe(token: string) {
  return apiRequest<{ user: AuthUser }>("/auth/me", {
    method: "GET",
    token
  });
}
