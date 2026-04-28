import { z } from "zod";

export const classParamsSchema = z.object({
  classId: z.string().uuid()
});

export const createAssignmentBodySchema = z.object({
  title: z.string().min(1),
  instructions: z.string().optional(),
  contentText: z.string().optional(),
  contentFileUrl: z.string().url().optional(),
  contentAudioUrl: z.string().url().optional(),
  dueDate: z.string().datetime().optional()
});

export type ClassParams = z.infer<typeof classParamsSchema>;
export type CreateAssignmentBody = z.infer<typeof createAssignmentBodySchema>;
