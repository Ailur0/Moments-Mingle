import { MongoClient, Db, Collection } from 'mongodb';

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

export interface UserProfile {
  _id?: string;
  email: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  createdAt?: Date;
}

export async function getUserProfile(email: string) {
  const client = await clientPromise;
  const db: Db = client.db();
  const users: Collection = db.collection('users');
  return users.findOne({ email });
}

export async function updateUserProfile(email: string, update: Partial<UserProfile>) {
  const client = await clientPromise;
  const db: Db = client.db();
  const users: Collection = db.collection('users');
  return users.updateOne({ email }, { $set: update });
}

export async function deleteUserProfile(email: string) {
  const client = await clientPromise;
  const db: Db = client.db();
  const users: Collection = db.collection('users');
  return users.deleteOne({ email });
}
