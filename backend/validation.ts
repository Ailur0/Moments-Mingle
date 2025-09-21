// Request validation schemas for Moments-Mingle backend using zod
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const memorySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  createdBy: z.string().min(1)
});

export const memoryJarSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  createdBy: z.string().min(1)
});

export const activitySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  createdBy: z.string().min(1)
});

export const pairingSchema = z.object({
  user1: z.string().min(1),
  user2: z.string().min(1),
  status: z.string().min(1)
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional()
});
