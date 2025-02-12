const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./index');

describe('User API Tests', () => {
  afterAll(async () => {
    await mongoose.connection.close(); 
  });

  test('should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'John Doe', email: 'john@example.com' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('John Doe');
  });

  test('should fetch all users', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('should return 404 for updating a non-existent user', async () => {
    const res = await request(app)
      .put('/users/60c72b2f9b1e8d5f88b99c99') 
      .send({ name: 'Updated Name' });

    expect(res.status).toBe(404);
  });
});
