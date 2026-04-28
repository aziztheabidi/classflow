import { z } from "zod";

export const authRoleSchema = z.enum(["TEACHER", "STUDENT"]);

export const sendOtpBodySchema = z.object({
  phoneNumber: z.string().min(8),
  role: authRoleSchema,
  name: z.string().min(1).optional()
});

export const verifyOtpBodySchema = z.object({
  phoneNumber: z.string().min(8),
  otp: z.string().min(1),
  role: authRoleSchema,
  name: z.string().min(1).optional()
});

export type SendOtpBody = z.infer<typeof sendOtpBodySchema>;
export type VerifyOtpBody = z.infer<typeof verifyOtpBodySchema>;
