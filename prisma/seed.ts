import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();
import { CommonService } from '../src/common/common.service';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const commonService = app.get(CommonService);
  const mongoUrl = process.env.DB_URL!;
  const dbName = process.env.DB_NAME!;

  if (!mongoUrl || !dbName) {
    throw new Error('Missing DATABASE_URL or DB_NAME in .env');
  }

  const client = new MongoClient(mongoUrl);
  await client.connect();

  const db = client.db(dbName);
  const users = db.collection('User');

  const now = new Date();

  // Hash passwords separately
  const hashedPassword = await commonService.hash(process.env.DEMO_PASSWORD!);

  await users.updateOne(
    { email: 'admin.developer@yopmail.com' },
    {
      $setOnInsert: {
        name: 'Saurabh Tiwari',
        password: hashedPassword,
        role: 'ADMIN',
        isDeleted: false,
        isBlocked: false,
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );

  console.log('✅ Users seeded successfully!');

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
