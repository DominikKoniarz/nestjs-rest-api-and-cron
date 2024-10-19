import type { Request } from 'express';
import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { CreatePostDto, createPostSchema } from './posts.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createPostSchema))
  createPost(@Req() req: Request, @Body() body: CreatePostDto) {
    return this.postsService.create(req, body);
  }
}
