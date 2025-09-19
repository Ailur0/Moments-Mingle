import type { NextApiRequest, NextApiResponse } from 'next';
import { createMemory, getMemories, updateMemory, deleteMemory } from '@/backend/memories';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Optionally filter by user
      const { createdBy } = req.query;
      const filter = createdBy ? { createdBy: String(createdBy) } : {};
      const memories = await getMemories(filter);
      res.status(200).json(memories);
    } else if (req.method === 'POST') {
      const memory = req.body;
      const id = await createMemory(memory);
      res.status(201).json({ id });
    } else if (req.method === 'PUT') {
      const { id, ...update } = req.body;
      await updateMemory(id, update);
      res.status(200).json({ message: 'Memory updated' });
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      await deleteMemory(id);
      res.status(200).json({ message: 'Memory deleted' });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
