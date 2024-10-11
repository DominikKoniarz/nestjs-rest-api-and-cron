import { z } from 'zod';

export const userIdSchema = z.string().min(1);

export const createUserSchema = z.object({
  name: z.string().nullish(),
  email: z.string().email(),
  password: z.string().min(8),
});

export type UserIdDto = z.infer<typeof userIdSchema>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
