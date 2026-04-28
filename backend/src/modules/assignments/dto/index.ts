import { z } from "zod";

export const createAssignmentDto = z.object({
  schoolId: z.string().uuid(),
  classId: z.string().uuid(),
  title: z.string().min(1)
});

export type CreateAssignmentDto = z.infer<typeof createAssignmentDto>;
