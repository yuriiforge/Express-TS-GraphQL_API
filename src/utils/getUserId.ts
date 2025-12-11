import jwt, { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';

interface AuthTokenPayload extends JwtPayload {
  userId: string;
}

interface GetUserIdOptions {
  request?: {
    headers?: {
      authorization?: string;
    };
  };
  connection?: {
    context?: {
      Authorization?: string;
    };
  };
}

export default function getUserId(
  request: GetUserIdOptions,
  requireAuth: boolean = true
): string | null {
  const header =
    request.request?.headers?.authorization ||
    request.connection?.context?.Authorization;

  if (header) {
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AuthTokenPayload;
    return decoded.userId;
  }

  if (requireAuth) {
    throw new Error('Authentication required');
  }

  return null;
}
