import { z } from 'zod';

export const userIdSchema = z
  .string()
  .min(1, { message: 'Valid user ID is required' });

export const createUserSchema = z.object({
  name: z.string().min(1, { message: 'Invalid name' }).nullish(),
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string({ invalid_type_error: 'Invalid password' })
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

export type UserIdDto = z.infer<typeof userIdSchema>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
