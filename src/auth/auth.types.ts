import { z } from 'zod';
import { userSchema } from './auth.dto';

export type JwtConstants = {
  secret: string;
  refreshTokenCookieName: string;
  accessTokenExpiresInSec: number;
  refreshTokenExpiresInSec: number;
};

export type AccessTokenPayload = {
  sub: string;
};

export type RefreshTokenPayload = {
  sub: string;
};

export type AuthedUser = z.infer<typeof userSchema>;
