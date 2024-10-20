import type { AuthedUser } from 'src/auth/auth.types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { userSchema } from 'src/auth/auth.dto';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const unsafeUser = request['user'] as AuthedUser | undefined;

    if (!unsafeUser) {
      throw new Error('User not found');
    }

    const validationResult = userSchema.safeParse(unsafeUser);

    if (!validationResult.success) {
      throw new Error('User object corrupted');
    }

    const user = validationResult.data;

    return user;
  },
);
