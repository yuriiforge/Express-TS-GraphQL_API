import { Comment, Post, PrismaClient, User, Prisma } from '@prisma/client';
import { QueryParams } from '../../types/QueryParams';
import { CreateUserInput } from './dtos/create-user-input';
import { HashService } from '../../services/hash.service';
import generateToken from '../../utils/generateToken';
import { AuthPayload } from './dtos/auth-payload';

export class UserService {
  constructor(
    private readonly prisma: PrismaClient,
    private hashService: HashService
  ) {}

  async getUserPosts(userId: string): Promise<Post[]> {
    return this.prisma.post.findMany({ where: { authorId: parseInt(userId) } });
  }

  async getUserComments(userId: string): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: { authorId: parseInt(userId) },
    });
  }

  async getUsers(params: QueryParams): Promise<User[]> {
    const { query, skip, take } = params;

    const where: Prisma.UserWhereInput = query
      ? { name: { contains: query, mode: 'insensitive' } }
      : {};

    const users = await this.prisma.user.findMany({ where, skip, take });

    return users || [];
  }

  async createUser(data: CreateUserInput): Promise<AuthPayload> {
    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const hashedPassword = await this.hashService.hash(data.password);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        age: data.age,
      },
    });

    const token = generateToken(user.id.toString());

    return { user, token };
  }

  async login(data: { email: string; password: string }): Promise<AuthPayload> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) throw new Error('User not found');

    const match = await this.hashService.compare(data.password, user.password);
    if (!match) throw new Error('Incorrect password');

    const token = generateToken(user.id.toString());
    return { user, token };
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  async updateUser(id: number, data: any): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });

    return user;
  }
}
