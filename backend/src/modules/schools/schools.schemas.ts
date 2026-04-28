import { z } from "zod";

export const createSchoolBodySchema = z.object({
  name: z.string().min(1)
});

export type CreateSchoolBody = z.infer<typeof createSchoolBodySchema>;
