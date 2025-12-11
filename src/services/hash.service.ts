import bcrypt from 'bcryptjs';
import 'dotenv/config';

export class HashService {
  private saltRounds: number;

  constructor() {
    const rounds = process.env.HASH_SALT;
    if (!rounds) {
      throw new Error('HASH_SALT must be defined in .env');
    }

    this.saltRounds = parseInt(rounds, 10);
    if (isNaN(this.saltRounds)) throw new Error('HASH_SALT must be a number');
  }

  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, this.saltRounds);
  }

  async compare(incomingData: string, hashedData: string): Promise<boolean> {
    return bcrypt.compare(incomingData, hashedData);
  }
}

export const hashService = new HashService();
