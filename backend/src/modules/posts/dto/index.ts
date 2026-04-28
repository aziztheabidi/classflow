import { z } from "zod";

export const createPostDto = z.object({
  schoolId: z.string().uuid(),
  classId: z.string().uuid().nullable().optional()
});

export type CreatePostDto = z.infer<typeof createPostDto>;
