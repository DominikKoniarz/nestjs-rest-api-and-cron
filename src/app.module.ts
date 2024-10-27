import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RefreshTokensModule } from './refresh-tokens/refresh-tokens.module';
import { PostsModule } from './posts/posts.module';
import { DiskModule } from './disk/disk.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    RefreshTokensModule,
    PostsModule,
    DiskModule,
  ],
})
export class AppModule {}
