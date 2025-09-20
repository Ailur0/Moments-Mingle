import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

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

export interface Activity {
  _id?: ObjectId;
  title: string;
  description: string;
  date: string;
  createdBy: string; // userId or email
  createdAt?: Date;
}

export async function createActivity(activity: Activity) {
  const client = await clientPromise;
  const db: Db = client.db();
  const activities: Collection = db.collection('activities');
  const { _id, ...rest } = activity;
  const doc = { ...rest, createdAt: new Date() };
  const result = await activities.insertOne(doc);
  return result.insertedId;
}

export async function getActivities(filter: Partial<Activity> = {}) {
  const client = await clientPromise;
  const db: Db = client.db();
  const activities: Collection = db.collection('activities');
  // Convert string _id to ObjectId if present
  if (filter._id && typeof filter._id === 'string') {
    (filter as any)._id = new ObjectId(filter._id);
  }
  return activities.find(filter).toArray();
}

export async function updateActivity(id: ObjectId, update: Partial<Activity>) {
  const client = await clientPromise;
  const db: Db = client.db();
  const activities: Collection = db.collection('activities');
  return activities.updateOne({ _id: new ObjectId(id) }, { $set: update });
}

export async function deleteActivity(id: string) {
  const client = await clientPromise;
  const db: Db = client.db();
  const activities: Collection = db.collection('activities');
  return activities.deleteOne({ _id: new ObjectId(id) });
}
