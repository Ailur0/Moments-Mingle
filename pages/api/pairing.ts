import type { NextApiRequest, NextApiResponse } from 'next';
import { createPairing, getPairings, updatePairing, deletePairing } from '@/backend/pairing';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { user1, user2 } = req.query;
      const filter: any = {};
      if (user1) filter.user1 = String(user1);
      if (user2) filter.user2 = String(user2);
      const pairings = await getPairings(filter);
      res.status(200).json(pairings);
    } else if (req.method === 'POST') {
      const pairing = req.body;
      const id = await createPairing(pairing);
      res.status(201).json({ id });
    } else if (req.method === 'PUT') {
      const { id, ...update } = req.body;
      await updatePairing(id, update);
      res.status(200).json({ message: 'Pairing updated' });
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      await deletePairing(id);
      res.status(200).json({ message: 'Pairing deleted' });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
