import type { Request, Response } from 'express';
import type { AccessTokenPayload, RefreshTokenPayload } from './auth.types';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { RefreshTokensService } from 'src/refresh-tokens/refresh-tokens.service';

@Injectable()
export class AuthService {
  public saltRounds: number = 11;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private refreshTokensService: RefreshTokensService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  generateAccessToken(userId: string) {
    return this.jwtService.signAsync({ sub: userId }, { expiresIn: '5m' });
  }

  generateRefreshToken(userId: string) {
    return this.jwtService.signAsync({ sub: userId }, { expiresIn: '1d' });
  }

  verifyAccessToken(accessToken: string): Promise<AccessTokenPayload> {
    return this.jwtService.verifyAsync(accessToken, {
      secret: jwtConstants.secret,
    });
  }

  verifyRefreshToken(refreshToken: string): Promise<RefreshTokenPayload> {
    return this.jwtService.verifyAsync(refreshToken, {
      secret: jwtConstants.secret,
    });
  }

  setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie(jwtConstants.refreshTokenCookieName, refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  clearRefreshTokenCookie(res: Response) {
    res.clearCookie(jwtConstants.refreshTokenCookieName);
  }

  async register(data: RegisterUserDto) {
    const foundUser = await this.usersService.getUserByEmail(data.email);

    if (foundUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(data.password);

    const newUser = await this.usersService.createUser({
      email: data.email,
      password: hashedPassword,
    });

    return newUser;
  }

  async login(data: LoginUserDto, res: Response) {
    const user = await this.usersService.getUserByEmail(data.email);

    if (!user || !user.password) {
      await this.comparePasswords(data.password, ''); // This is a dummy call to prevent timing attacks
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordCorrect = await this.comparePasswords(
      data.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user.id),
      this.generateRefreshToken(user.id),
    ]);

    await this.refreshTokensService.addRefreshToken(
      refreshToken,
      user.id,
      new Date(Date.now() + 1000 * jwtConstants.refreshTokenExpiresInSec),
    );

    this.setRefreshTokenCookie(res, refreshToken);

    return {
      accessToken,
    };
  }

  async refreshAccessToken(req: Request, res: Response) {
    const refreshToken = req.cookies[jwtConstants.refreshTokenCookieName] as
      | string
      | undefined;

    if (!refreshToken) {
      throw new UnauthorizedException({ message: 'Refresh token not found' });
    }

    try {
      const foundUser =
        await this.usersService.getUserByRefreshToken(refreshToken);

      if (!foundUser) {
        throw new ForbiddenException();
      }

      const { sub: userId } = await this.verifyRefreshToken(refreshToken);

      if (foundUser.id !== userId) {
        throw new ForbiddenException();
      }

      const [accessToken, newRefreshToken] = await Promise.all([
        this.generateAccessToken(foundUser.id),
        this.generateRefreshToken(foundUser.id),
      ]);

      await Promise.all([
        this.refreshTokensService.deleteRefreshToken(refreshToken),
        this.refreshTokensService.addRefreshToken(
          newRefreshToken,
          foundUser.id,
          new Date(Date.now() + 1000 * jwtConstants.refreshTokenExpiresInSec),
        ),
      ]);

      this.setRefreshTokenCookie(res, newRefreshToken);

      return {
        accessToken,
      };
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;

      throw new UnauthorizedException({ message: 'Invalid refresh token' });
    }
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies[jwtConstants.refreshTokenCookieName] as
      | string
      | undefined;

    if (refreshToken) {
      await this.refreshTokensService.deleteRefreshToken(refreshToken);
      this.clearRefreshTokenCookie(res);
    }

    res.status(HttpStatus.NO_CONTENT);

    return;
  }
}
