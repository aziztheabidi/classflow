import { z } from "zod";

export const assignmentParamsSchema = z.object({
  assignmentId: z.string().uuid()
});

export const createSubmissionBodySchema = z
  .object({
    textSubmission: z.string().optional(),
    fileUrl: z.string().url().optional(),
    audioUrl: z.string().url().optional()
  })
  .refine(
    (value) => Boolean(value.textSubmission || value.fileUrl || value.audioUrl),
    "At least one submission field is required"
  );

export type AssignmentParams = z.infer<typeof assignmentParamsSchema>;
export type CreateSubmissionBody = z.infer<typeof createSubmissionBodySchema>;
