import type { JwtConstants } from './auth.types';

export const jwtConstants: JwtConstants = {
  secret: process.env.AUTH_SECRET ?? 'secret',
};
