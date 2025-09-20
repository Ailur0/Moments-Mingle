import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '@/backend/profile';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { email } = req.query;
      if (!email) return res.status(400).json({ error: 'Email required' });
      const user = await getUserProfile(String(email));
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.status(200).json(user);
    } else if (req.method === 'PUT') {
      const { email, ...update } = req.body;
      if (!email) return res.status(400).json({ error: 'Email required' });
      await updateUserProfile(email, update);
      res.status(200).json({ message: 'Profile updated' });
    } else if (req.method === 'DELETE') {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'Email required' });
      await deleteUserProfile(email);
      res.status(200).json({ message: 'Profile deleted' });
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
