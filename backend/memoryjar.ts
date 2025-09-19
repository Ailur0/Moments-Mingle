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

export interface MemoryJar {
  _id?: string;
  title: string;
  description: string;
  date: string;
  createdBy: string; // userId or email
  createdAt?: Date;
}

export async function createMemoryJar(memoryJar: MemoryJar) {
  const client = await clientPromise;
  const db: Db = client.db();
  const jars: Collection = db.collection('memory_jars');
  const doc = { ...memoryJar, createdAt: new Date() };
  const result = await jars.insertOne(doc);
  return result.insertedId;
}

export async function getMemoryJars(filter: Partial<MemoryJar> = {}) {
  const client = await clientPromise;
  const db: Db = client.db();
  const jars: Collection = db.collection('memory_jars');
  return jars.find(filter).toArray();
}

export async function updateMemoryJar(id: string, update: Partial<MemoryJar>) {
  const client = await clientPromise;
  const db: Db = client.db();
  const jars: Collection = db.collection('memory_jars');
  const { ObjectId } = await import('mongodb');
  return jars.updateOne({ _id: new ObjectId(id) }, { $set: update });
}

export async function deleteMemoryJar(id: string) {
  const client = await clientPromise;
  const db: Db = client.db();
  const jars: Collection = db.collection('memory_jars');
  const { ObjectId } = await import('mongodb');
  return jars.deleteOne({ _id: new ObjectId(id) });
}
