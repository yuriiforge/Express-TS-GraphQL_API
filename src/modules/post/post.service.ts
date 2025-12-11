import { PrismaClient, Post, Prisma } from '@prisma/client';
import { QueryParams } from '../../types/QueryParams';
import { CreatePostInput } from './dtos/create-post-input';
import { UpdatePostInput } from './dtos/update-post-input';
import prisma from '../../prisma';

export class PostService {
  constructor(private prisma: PrismaClient = prisma) {}

  async getPosts(params: QueryParams): Promise<Post[]> {
    const { query, skip, take } = params;
    const where: Prisma.PostWhereInput = query
      ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { body: { contains: query, mode: 'insensitive' } },
          ],
          published: true,
        }
      : { published: true };

    return this.prisma.post.findMany({ where, skip, take });
  }

  async getPostById(id: number) {
    return this.prisma.post.findUniqueOrThrow({ where: { id } });
  }

  async createPost(data: CreatePostInput) {
    return this.prisma.post.create({
      data: {
        title: data.title,
        body: data.body,
        published: data.published,
        author: { connect: { id: data.authorId } },
      },
    });
  }

  async updatePost(id: number, data: UpdatePostInput) {
    return this.prisma.post.update({ where: { id }, data });
  }

  async deletePost(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
}
