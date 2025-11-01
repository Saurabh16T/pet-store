import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();
import { HashService } from '../src/common/hash.service';

const hashService = new HashService();

async function main() {
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
  const hashedPassword = await hashService.hash(process.env.DEMO_PASSWORD!);

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
