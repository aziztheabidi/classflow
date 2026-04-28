import { z } from "zod";

export const createClassBodySchema = z.object({
  schoolId: z.string().uuid(),
  name: z.string().min(1)
});

export const joinClassBodySchema = z.object({
  joinCode: z.string().length(6).transform((value) => value.toUpperCase())
});

export type CreateClassBody = z.infer<typeof createClassBodySchema>;
export type JoinClassBody = z.infer<typeof joinClassBodySchema>;
