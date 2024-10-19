import type { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './posts.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(request: Request, data: CreatePostDto) {
    const userId = request['user'].sub as string | undefined;

    if (!userId) {
      throw new Error('User not found');
    }

    // TODO: check if post with this title already exists

    const createdPost = await this.prisma.post.create({
      data: {
        ...data,
        authorId: userId,
      },
    });

    return {
      createdPost,
    };
  }
}
