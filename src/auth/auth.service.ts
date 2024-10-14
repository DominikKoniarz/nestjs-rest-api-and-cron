import type { Response } from 'express';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  public saltRounds: number = 11;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
    return this.jwtService.signAsync({ sub: userId });
  }

  generateRefreshToken(userId: string) {
    return this.jwtService.signAsync({ sub: userId }, { expiresIn: '1d' });
  }

  setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('auth.refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
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

    this.setRefreshTokenCookie(res, refreshToken);

    return {
      accessToken,
    };
  }
}
