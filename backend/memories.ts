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

export interface Memory {
  _id?: string;
  title: string;
  description: string;
  date: string;
  createdBy: string; // userId or email
  createdAt?: Date;
}

export async function createMemory(memory: Memory) {
  const client = await clientPromise;
  const db: Db = client.db();
  const memories: Collection = db.collection('memories');
  const doc = { ...memory, createdAt: new Date() };
  const result = await memories.insertOne(doc);
  return result.insertedId;
}

export async function getMemories(filter: Partial<Memory> = {}) {
  const client = await clientPromise;
  const db: Db = client.db();
  const memories: Collection = db.collection('memories');
  return memories.find(filter).toArray();
}

export async function updateMemory(id: string, update: Partial<Memory>) {
  const client = await clientPromise;
  const db: Db = client.db();
  const memories: Collection = db.collection('memories');
  const { ObjectId } = await import('mongodb');
  return memories.updateOne({ _id: new ObjectId(id) }, { $set: update });
}

export async function deleteMemory(id: string) {
  const client = await clientPromise;
  const db: Db = client.db();
  const memories: Collection = db.collection('memories');
  const { ObjectId } = await import('mongodb');
  return memories.deleteOne({ _id: new ObjectId(id) });
}
