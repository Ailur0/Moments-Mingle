// MongoDB-based authentication logic for Moments-Mingle
import { MongoClient, Db, Collection } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI!;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function createUser(email: string, password: string, name: string) {
  const client = await clientPromise;
  const db: Db = client.db();
  const users: Collection = db.collection('users');
  const existing = await users.findOne({ email });
  if (existing) throw new Error('User already exists');
  const hashed = await bcrypt.hash(password, 10);
  const user = { email, password: hashed, name, createdAt: new Date() };
  await users.insertOne(user);
  return { email, name };
}

export async function loginUser(email: string, password: string) {
  const client = await clientPromise;
  const db: Db = client.db();
  const users: Collection = db.collection('users');
  const user = await users.findOne({ email });
  if (!user) throw new Error('User not found');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');
  return { email: user.email, name: user.name };
}
