import { z } from "zod";

export const submissionParamsSchema = z.object({
  submissionId: z.string().uuid()
});

export const upsertFeedbackBodySchema = z.object({
  comment: z.string().optional(),
  markedDone: z.boolean()
});

export type SubmissionParams = z.infer<typeof submissionParamsSchema>;
export type UpsertFeedbackBody = z.infer<typeof upsertFeedbackBodySchema>;
