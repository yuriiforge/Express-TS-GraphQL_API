import { Post } from '@prisma/client';

export type UpdatePostInput = Partial<Omit<Post, 'id'>>;
