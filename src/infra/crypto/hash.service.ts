import { Injectable } from '@nestjs/common';
import { compareSync, hash } from 'bcryptjs';
import { Hash } from './hash';

@Injectable()
export class HashService implements Hash {
  async hash(plain: string): Promise<string> {
    return await hash(plain, 8);
  }
  async compare(plain: string, password: string): Promise<boolean> {
    return compareSync(plain, password);
  }
}
