import { z } from "zod";

export const createSubmissionDto = z.object({
  schoolId: z.string().uuid(),
  assignmentId: z.string().uuid()
});

export type CreateSubmissionDto = z.infer<typeof createSubmissionDto>;
