import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RefreshTokensModule } from './refresh-tokens/refresh-tokens.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, RefreshTokensModule, PostsModule],
})
export class AppModule {}
