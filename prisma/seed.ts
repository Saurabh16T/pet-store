import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();
import { HashService } from '../src/common/hash.service';

const hashService = new HashService();

async function main() {
  const mongoUrl = process.env.DATABASE_URL!;
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
  const hashedAlice = await hashService.hash('password123');
  const hashedBob = await hashService.hash('secure456');

  await users.updateOne(
    { email: 'alice@example.com' },
    { 
      $setOnInsert: { 
        name: 'Alice Johnson', 
        password: hashedAlice, 
        role: 'USER', 
        createdAt: now, 
        updatedAt: now 
      } 
    },
    { upsert: true }
  );

  await users.updateOne(
    { email: 'bob@example.com' },
    { 
      $setOnInsert: { 
        name: 'Bob Smith', 
        password: hashedBob, 
        role: 'USER', 
        createdAt: now, 
        updatedAt: now 
      } 
    },
    { upsert: true }
  );

  console.log('✅ Users seeded successfully!');

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
