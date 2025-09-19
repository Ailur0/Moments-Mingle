import type { NextApiRequest, NextApiResponse } from 'next';
import { createActivity, getActivities, updateActivity, deleteActivity } from '@/backend/activities';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { createdBy } = req.query;
      const filter = createdBy ? { createdBy: String(createdBy) } : {};
      const activities = await getActivities(filter);
      res.status(200).json(activities);
    } else if (req.method === 'POST') {
      const activity = req.body;
      const id = await createActivity(activity);
      res.status(201).json({ id });
    } else if (req.method === 'PUT') {
      const { id, ...update } = req.body;
      await updateActivity(id, update);
      res.status(200).json({ message: 'Activity updated' });
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      await deleteActivity(id);
      res.status(200).json({ message: 'Activity deleted' });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
