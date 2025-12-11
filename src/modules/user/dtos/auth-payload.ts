import { User } from '@prisma/client';

export interface AuthPayload {
  user: User;
  token: string;
}
