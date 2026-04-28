import { z } from "zod";

export const createSchoolDto = z.object({
  name: z.string().min(1)
});

export type CreateSchoolDto = z.infer<typeof createSchoolDto>;
