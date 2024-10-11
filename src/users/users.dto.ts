import { z } from 'zod';

export const getUserSchema = z.object({
  id: z.string().min(1),
});

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export type GetUserDto = z.infer<typeof getUserSchema>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
