import type { AuthedUser } from 'src/auth/auth.types';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './posts.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(private prisma: PrismaService) {}

  getPostByTitle(title: string, authorId: string) {
    return this.prisma.post.findFirst({
      where: {
        title,
        authorId,
      },
    });
  }

  getPostById(postId: string) {
    return this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
  }

  async create(user: AuthedUser, data: CreatePostDto) {
    const userId = user.id;

    if (!userId) {
      throw new Error('User not found');
    }

    const foundPost = await this.getPostByTitle(data.title, userId);

    if (foundPost)
      throw new ConflictException(
        'Post with this title already exists for this user',
      );

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

  async getSingle(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) throw new NotFoundException('Post not found');

    return post;
  }

  async getPostsCount() {
    return this.prisma.post.count();
  }

  @Cron('30 * * * * *')
  async handlePostsCountLogCron() {
    const postsCount = await this.getPostsCount();

    this.logger.log(`Posts count: ${postsCount}`);
  }
}
