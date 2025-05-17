const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Connect to the in-memory database
module.exports.connect = async () => {
  try {
    // If already connected, disconnect first
    if (mongoose.connection.readyState) {
      await mongoose.disconnect();
    }
    
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('Error connecting to test database:', error);
    throw error;
  }
};

// Disconnect and close connection
module.exports.closeDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('Error closing test database:', error);
    throw error;
  }
};

// Clear all collections
module.exports.clearDatabase = async () => {
  try {
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  } catch (error) {
    console.error('Error clearing test database:', error);
    throw error;
  }
};

// This is not a test file, but a helper module
if (process.env.NODE_ENV === 'test') {
  test('dummy test to avoid Jest warning', () => {
    expect(true).toBe(true);
  });
} 