import { z } from "zod";

export const signInDto = z.object({
  phoneNumber: z.string().min(8)
});

export type SignInDto = z.infer<typeof signInDto>;
