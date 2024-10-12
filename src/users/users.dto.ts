import { z } from 'zod';

export const userIdSchema = z
  .string()
  .min(1, { message: 'Valid user ID is required' });

export const registerUserSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z
      .string({ invalid_type_error: 'Invalid password' })
      .min(8, { message: 'Password must be at least 8 characters long' }),
    repeatPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.repeatPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['repeatPassword'],
      });
    }
  });

export type UserIdDto = z.infer<typeof userIdSchema>;
export type RegisterUserDto = z.infer<typeof registerUserSchema>;
export type CreateUserDto = Pick<RegisterUserDto, 'email' | 'password'>;
