import { z } from "zod";

export const createFeedbackDto = z.object({
  schoolId: z.string().uuid(),
  submissionId: z.string().uuid()
});

export type CreateFeedbackDto = z.infer<typeof createFeedbackDto>;
