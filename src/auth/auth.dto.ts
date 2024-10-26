import { Role } from '@prisma/client';
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().min(1),
  role: z.nativeEnum(Role),
});
