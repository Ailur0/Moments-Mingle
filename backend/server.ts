// Load environment variables from .env.local (requires 'dotenv' package)
try { require('dotenv').config({ path: '.env.local' }); } catch {}
// For best TypeScript experience, install:
// npm install --save-dev @types/express @types/body-parser @types/cors
// For request validation, install:
// npm install zod
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ObjectId } from 'mongodb';

// Import your backend modules
import * as auth from './auth';
import * as memories from './memories';
import * as memoryjar from './memoryjar';
import * as activities from './activities';
import * as pairing from './pairing';
import * as profile from './profile';
import { signupSchema, loginSchema, memorySchema, memoryJarSchema, activitySchema, pairingSchema, profileUpdateSchema } from './validation';
import { authenticateToken, generateToken } from './authMiddleware';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Health check
app.get('/', (req, res) => {
  res.send('Moments Mingle Backend is running!');
});

// AUTH
app.post('/api/signup', async (req: Request, res: Response) => {
  try {
    const parseResult = signupSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues });
    }
    const { email, password, name } = parseResult.data;
    const user = await auth.createUser(email, password, name);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', async (req: Request, res: Response) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues });
    }
    const { email, password } = parseResult.data;
    const user = await auth.loginUser(email, password);
    // Return JWT token
    const token = generateToken({ email: user.email, name: user.name });
    res.json({ user, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Add zod validation for other endpoints as needed, using the schemas in validation.ts

// MEMORIES
app.get('/api/memories', async (req, res) => {
  try {
    const filter = req.query || {};
    const memoriesList = await memories.getMemories(filter);
    res.json(memoriesList);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/memories', authenticateToken, async (req: Request, res: Response) => {
  try {
    const parseResult = memorySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues });
    }
    const id = await memories.createMemory(parseResult.data);
    res.json({ insertedId: id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/memories/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const parseResult = memorySchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues });
    }
    const result = await memories.updateMemory(new ObjectId(req.params.id), parseResult.data);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.delete('/api/memories/:id', authenticateToken, async (req, res) => {
  try {
    const result = await memories.deleteMemory(req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// MEMORY JARS
app.get('/api/memoryjars', async (req, res) => {
  try {
    const filter = req.query || {};
    const jars = await memoryjar.getMemoryJars(filter);
    res.json(jars);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/memoryjars', authenticateToken, async (req: Request, res: Response) => {
  try {
    const parseResult = memoryJarSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues });
    }
    const id = await memoryjar.createMemoryJar(parseResult.data);
    res.json({ insertedId: id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/memoryjars/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const parseResult = memoryJarSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues });
    }
    const result = await memoryjar.updateMemoryJar(new ObjectId(req.params.id), parseResult.data);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.delete('/api/memoryjars/:id', authenticateToken, async (req, res) => {
  try {
    const result = await memoryjar.deleteMemoryJar(req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ACTIVITIES
app.get('/api/activities', async (req, res) => {
  try {
    const filter = req.query || {};
    const activitiesList = await activities.getActivities(filter);
    res.json(activitiesList);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/activities', authenticateToken, async (req: Request, res: Response) => {
  try {
    const parseResult = activitySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues });
    }
    const id = await activities.createActivity(parseResult.data);
    res.json({ insertedId: id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/activities/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const parseResult = activitySchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues });
    }
    const result = await activities.updateActivity(new ObjectId(req.params.id), parseResult.data);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.delete('/api/activities/:id', authenticateToken, async (req, res) => {
  try {
    const result = await activities.deleteActivity(req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PAIRINGS
app.get('/api/pairings', async (req, res) => {
  try {
    const filter = req.query || {};
    const pairingsList = await pairing.getPairings(filter);
    res.json(pairingsList);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/pairings', authenticateToken, async (req: Request, res: Response) => {
  try {
    const parseResult = pairingSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues });
    }
    const id = await pairing.createPairing(parseResult.data);
    res.json({ insertedId: id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/pairings/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const parseResult = pairingSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues });
    }
    const result = await pairing.updatePairing(req.params.id, parseResult.data);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.delete('/api/pairings/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pairing.deletePairing(req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PROFILES
app.get('/api/profile/:email', async (req, res) => {
  try {
    const profileData = await profile.getUserProfile(req.params.email);
    res.json(profileData);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/profile/:email', authenticateToken, async (req: Request, res: Response) => {
  try {
    const parseResult = profileUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues });
    }
    const result = await profile.updateUserProfile(req.params.email, parseResult.data);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.delete('/api/profile/:email', authenticateToken, async (req, res) => {
  try {
    const result = await profile.deleteUserProfile(req.params.email);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

import { errorHandler } from './errorHandler';

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
