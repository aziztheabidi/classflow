import { z } from "zod";

export const createUserDto = z.object({
  phoneNumber: z.string().min(8),
  name: z.string().min(1).nullable().optional()
});

export type CreateUserDto = z.infer<typeof createUserDto>;
