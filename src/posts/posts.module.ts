import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
  imports: [AuthModule, UsersModule],
})
export class PostsModule {}
