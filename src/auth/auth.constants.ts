import type { JwtConstants } from './auth.types';

export const jwtConstants: JwtConstants = {
  secret: process.env.AUTH_SECRET ?? 'secret123123',
  refreshTokenCookieName: 'auth.refreshToken',
  accessTokenExpiresInSec: 60,
  refreshTokenExpiresInSec: 60 * 60 * 24,
};
