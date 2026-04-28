import { z } from "zod";

export const classParamsSchema = z.object({
  classId: z.string().uuid()
});

export const createClassPostBodySchema = z
  .object({
  type: z.literal("MESSAGE"),
  contentText: z.string().optional(),
  contentFileUrl: z.string().url().optional(),
  contentAudioUrl: z.string().url().optional()
  })
  .refine(
    (value) => Boolean(value.contentText || value.contentFileUrl || value.contentAudioUrl),
    "At least one content field is required"
  );

export const classFeedQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().uuid().optional()
});

export type ClassParams = z.infer<typeof classParamsSchema>;
export type CreateClassPostBody = z.infer<typeof createClassPostBodySchema>;
export type ClassFeedQuery = z.infer<typeof classFeedQuerySchema>;
