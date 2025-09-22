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

import { ObjectId } from 'mongodb';

export interface Pairing {
  _id?: ObjectId;
  user1: string; // userId or email
  user2: string; // userId or email
  status: string; // e.g., 'pending', 'accepted', 'rejected'
  createdAt?: Date;
}

export async function createPairing(pairing: Omit<Pairing, '_id'>) {
  const client = await clientPromise;
  const db: Db = client.db();
  const pairings: Collection<Pairing> = db.collection('pairings');
  const doc = { ...pairing, createdAt: new Date() };
  const result = await pairings.insertOne(doc);
  return result.insertedId;
}

export async function getPairings(filter: Partial<Pairing> = {}) {
  const client = await clientPromise;
  const db: Db = client.db();
  const pairings: Collection<Pairing> = db.collection('pairings');
  // Convert string _id in filter to ObjectId if present
  const mongoFilter: any = { ...filter };
  if (mongoFilter._id && typeof mongoFilter._id === 'string') {
    mongoFilter._id = new ObjectId(mongoFilter._id);
  }
  return pairings.find(mongoFilter).toArray();
}

export async function updatePairing(id: string, update: Partial<Pairing>) {
  const client = await clientPromise;
  const db: Db = client.db();
  const pairings: Collection = db.collection('pairings');
  const { ObjectId } = await import('mongodb');
  return pairings.updateOne({ _id: new ObjectId(id) }, { $set: update });
}

export async function deletePairing(id: string) {
  const client = await clientPromise;
  const db: Db = client.db();
  const pairings: Collection = db.collection('pairings');
  const { ObjectId } = await import('mongodb');
  return pairings.deleteOne({ _id: new ObjectId(id) });
}
