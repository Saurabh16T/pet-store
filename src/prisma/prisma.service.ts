import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();

      const dbUrl = process.env.DATABASE_URL || '(not set)';
      console.log('✅ Prisma connected to the database.');
      console.log(`🔗 Connected to: ${dbUrl}`);
    } catch (err) {
      console.error('❌ Failed to connect to Prisma database:', err);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
