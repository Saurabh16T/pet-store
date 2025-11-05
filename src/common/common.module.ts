// src/common/common.module.ts
import { Module } from '@nestjs/common';
import { CommonService } from './common.service';

@Module({
  providers: [CommonService],
  exports: [CommonService], // 👈 allows other modules to use it
})
export class CommonModule {}
