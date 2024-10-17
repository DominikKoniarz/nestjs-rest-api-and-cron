import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RefreshTokensService {
  constructor(private prisma: PrismaService) {}

  addRefreshToken(refreshToken: string, userId: string, expiresAt: Date) {
    return this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        expiresAt,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  deleteRefreshToken(refreshToken: string) {
    return this.prisma.refreshToken.deleteMany({
      where: {
        token: refreshToken,
      },
    });
  }
}
