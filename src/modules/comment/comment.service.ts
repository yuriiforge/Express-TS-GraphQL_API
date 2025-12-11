import { PrismaClient, Comment } from '@prisma/client';

type CreateCommentInput = Omit<Comment, 'id'>;
type UpdateCommentInput = Partial<Omit<Comment, 'id'>>;

export class CommentService {
  constructor(private prisma: PrismaClient) {}

  async createComment(data: CreateCommentInput) {
    return this.prisma.comment.create({ data });
  }

  async updateComment(id: number, data: UpdateCommentInput) {
    return this.prisma.comment.update({ where: { id }, data });
  }

  async deleteComment(id: number) {
    return this.prisma.comment.delete({ where: { id } });
  }

  async getComments(skip?: number, take?: number) {
    return this.prisma.comment.findMany({ skip, take });
  }

  async getCommentById(id: number) {
    return this.prisma.comment.findUniqueOrThrow({ where: { id } });
  }
}
