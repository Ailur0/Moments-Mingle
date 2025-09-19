import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db();
  const users = db.collection('users');

  if (req.method === 'POST') {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Check if user exists
    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }
    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    const user = { email, password: hashed, name, createdAt: new Date() };
    await users.insertOne(user);
    res.status(201).json({ message: 'User created' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
