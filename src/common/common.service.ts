// src/common/common.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CommonService {
  // Shared function
  generateUniqueId(): string {
    return `UID-${Math.floor(Math.random() * 10000)}`;
  }

  async hash(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
