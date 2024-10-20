import type { AuthedUser } from 'src/auth/auth.types';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { CreatePostDto, createPostSchema } from './posts.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createPostSchema))
  createPost(@User() user: AuthedUser, @Body() body: CreatePostDto) {
    return this.postsService.create(user, body);
  }

  @Get(':postId')
  getPostById(@Param('postId') postId: string) {
    return this.postsService.getSingle(postId);
  }
}
