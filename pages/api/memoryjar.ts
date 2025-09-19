import type { NextApiRequest, NextApiResponse } from 'next';
import { createMemoryJar, getMemoryJars, updateMemoryJar, deleteMemoryJar } from '@/backend/memoryjar';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { createdBy } = req.query;
      const filter = createdBy ? { createdBy: String(createdBy) } : {};
      const notes = await getMemoryJars(filter);
      res.status(200).json(notes);
    } else if (req.method === 'POST') {
      const note = req.body;
      const id = await createMemoryJar(note);
      res.status(201).json({ id });
    } else if (req.method === 'PUT') {
      const { id, ...update } = req.body;
      await updateMemoryJar(id, update);
      res.status(200).json({ message: 'Note updated' });
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      await deleteMemoryJar(id);
      res.status(200).json({ message: 'Note deleted' });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
