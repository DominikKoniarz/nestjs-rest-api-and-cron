import type { CreateUserDto } from './users.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const responseData = {
      data: users,
    };

    return responseData;
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserByEmail(email: string, throwOnNotFound: boolean = false) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      if (throwOnNotFound) {
        throw new NotFoundException('User not found');
      }

      return null;
    }

    return user;
  }

  async getUserByRefreshToken(refreshToken: string) {
    return this.prisma.user.findFirst({
      where: {
        refreshTokens: {
          some: {
            token: refreshToken,
          },
        },
      },
    });
  }

  async createUser(user: CreateUserDto) {
    const foundUser = await this.getUserByEmail(user.email);

    if (foundUser) {
      throw new ConflictException('User with this email already exists');
    }

    return this.prisma.user.create({
      data: {
        email: user.email,
        password: user.password,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }
}
