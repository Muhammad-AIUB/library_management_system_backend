const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server'); // Import the Express app
const Notification = require('../../models/notification.model');
const dbSetup = require('../setup/dbSetup');

// Mock data
const mockUser = new mongoose.Types.ObjectId();
const mockNotification = {
  user: mockUser,
  title: 'Test Notification',
  message: 'This is a test notification',
  type: 'system'
};

// Connect to test database before tests
beforeAll(async () => {
  await dbSetup.connect();
});

// Clean up after tests
afterAll(async () => {
  await dbSetup.clearDatabase();
  await dbSetup.closeDatabase();
});

describe('Notification Controller', () => {
  // Clean up before each test
  beforeEach(async () => {
    await Notification.deleteMany({});
  });

  // Test creating a notification
  test('should create a new notification', async () => {
    const res = await request(app)
      .post('/api/notifications')
      .send(mockNotification);
    
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.title).toBe(mockNotification.title);
    expect(res.body.data.message).toBe(mockNotification.message);
  });

  // Test getting user notifications
  test('should get user notifications', async () => {
    // Create test notification in DB first
    await Notification.create(mockNotification);
    
    const res = await request(app)
      .get(`/api/notifications/user/${mockUser}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // Test marking notification as read
  test('should mark notification as read', async () => {
    // Create test notification
    const notification = await Notification.create(mockNotification);
    
    const res = await request(app)
      .put(`/api/notifications/${notification._id}/read`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.data.read).toBe(true);
  });
}); 