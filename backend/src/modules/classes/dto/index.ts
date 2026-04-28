import { z } from "zod";

export const createClassDto = z.object({
  schoolId: z.string().uuid(),
  name: z.string().min(1),
  teacherId: z.string().uuid()
});

export type CreateClassDto = z.infer<typeof createClassDto>;
