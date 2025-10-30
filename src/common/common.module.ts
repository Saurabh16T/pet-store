// src/common/common.module.ts
import { Module } from '@nestjs/common';
import { HashService } from './hash.service';

@Module({
  providers: [HashService],
  exports: [HashService], // 👈 allows other modules to use it
})
export class CommonModule {}
