// Example test for the signup endpoint using supertest and jest
import request from 'supertest';
import { app } from './server';

describe('POST /api/signup', () => {
  it('should return 200 and a user object for valid input', async () => {
    const res = await request(app)
      .post('/api/signup')
      .send({ email: 'test@example.com', password: 'password123', name: 'Test User' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'test@example.com');
    expect(res.body).toHaveProperty('name', 'Test User');
  });

  it('should return 400 for invalid input', async () => {
    const res = await request(app)
      .post('/api/signup')
      .send({ email: 'not-an-email', password: 'short', name: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
