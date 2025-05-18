const axios = require('axios');
require('dotenv').config();

// Configuration
const BASE_URL = 'http://localhost:3000'; // update with your server URL
let authToken = '';
let userId = '';
let bookId = '';
let goalId = '';
let notificationId = '';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Helper function to log results
const logResult = (endpoint, success, data = null, error = null) => {
  const status = success 
    ? `${colors.green}SUCCESS${colors.reset}` 
    : `${colors.red}FAILED${colors.reset}`;
  
  console.log(`\n${colors.blue}[TEST]${colors.reset} ${endpoint} - ${status}`);
  
  if (data) {
    console.log(`${colors.yellow}Response:${colors.reset}`, 
      typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
  }
  
  if (error) {
    console.log(`${colors.red}Error:${colors.reset}`, error);
  }
  
  return success;
};

// Main test function
async function testAllApis() {
  console.log(`${colors.blue}=== TESTING ALL LIBRARY MANAGEMENT SYSTEM APIS ===${colors.reset}\n`);
  
  try {
    // 1. Test User Registration with new auth endpoint
    const uniqueEmail = `test_${Date.now()}@example.com`; // Generate unique email
    try {
      const registerRes = await axios.post(`${BASE_URL}/api/auth/register`, {
        name: 'Test User',
        email: uniqueEmail,
        password: 'Password123!'
      });
      
      userId = registerRes.data.user._id || registerRes.data.user.id;
      authToken = registerRes.data.token;
      logResult('Register User (Auth)', true, registerRes.data);
    } catch (error) {
      logResult('Register User (Auth)', false, null, error.response?.data || error.message);
    }

    // 2. Test User Login with new auth endpoint
    try {
      const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: uniqueEmail,
        password: 'Password123!'
      });
      
      authToken = loginRes.data.token;
      if (!userId) userId = loginRes.data.user._id || loginRes.data.user.id;
      
      logResult('Login User (Auth)', true, loginRes.data);
    } catch (error) {
      // If login fails, try with a known user
      try {
        const fallbackLoginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
          email: 'test@example.com',
          password: 'Password123!'
        });
        
        authToken = fallbackLoginRes.data.token;
        userId = fallbackLoginRes.data.user._id || fallbackLoginRes.data.user.id;
        
        logResult('Login User (Auth - fallback)', true, fallbackLoginRes.data);
      } catch (fallbackError) {
        logResult('Login User (Auth)', false, null, error.response?.data || error.message);
        console.log(`${colors.red}Could not authenticate. Stopping tests.${colors.reset}`);
        return;
      }
    }

    // 3. Test Get Profile with new auth endpoint
    if (authToken) {
      try {
        const profileConfig = {
          headers: { Authorization: `Bearer ${authToken}` }
        };
        
        const profileRes = await axios.get(`${BASE_URL}/api/auth/profile`, profileConfig);
        logResult('Get User Profile (Auth)', true, profileRes.data);
      } catch (error) {
        logResult('Get User Profile (Auth)', false, null, error.response?.data || error.message);
      }
    }

    // Setup axios config with auth token
    const config = {
      headers: { Authorization: `Bearer ${authToken}` }
    };

    // 4. Test Book Creation
    try {
      const bookRes = await axios.post(`${BASE_URL}/api/books`, {
        title: `Test Book ${Date.now()}`,
        author: 'Test Author',
        genre: 'Fiction',
        pages: 300,
        description: 'This is a test book'
      }, config);
      
      bookId = bookRes.data._id || bookRes.data.id;
      logResult('Create Book', true, bookRes.data);
    } catch (error) {
      logResult('Create Book', false, null, error.response?.data || error.message);
    }

    // 5. Test Get All Books
    try {
      const booksRes = await axios.get(`${BASE_URL}/api/books`, config);
      logResult('Get All Books', true, booksRes.data);
    } catch (error) {
      logResult('Get All Books', false, null, error.response?.data || error.message);
    }

    // 6. Test Reading Goal Creation
    try {
      const goalRes = await axios.post(`${BASE_URL}/api/reading-goals`, {
        user: userId,
        type: 'books',
        targetBooks: 10,
        duration: 'monthly',
        startDate: new Date().toISOString().split('T')[0] // Today's date
      }, config);
      
      goalId = goalRes.data._id || goalRes.data.id;
      logResult('Create Reading Goal', true, goalRes.data);
    } catch (error) {
      logResult('Create Reading Goal', false, null, error.response?.data || error.message);
    }

    // 7. Test Get User Goals
    try {
      const userGoalsRes = await axios.get(`${BASE_URL}/api/reading-goals/user/${userId}`, config);
      logResult('Get User Goals', true, userGoalsRes.data);
    } catch (error) {
      logResult('Get User Goals', false, null, error.response?.data || error.message);
    }

    // 8. Test Create Notification
    try {
      const notificationRes = await axios.post(`${BASE_URL}/api/notifications`, {
        user: userId,
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'system'
      }, config);
      
      notificationId = notificationRes.data._id || notificationRes.data.id;
      logResult('Create Notification', true, notificationRes.data);
    } catch (error) {
      logResult('Create Notification', false, null, error.response?.data || error.message);
    }

    // 9. Test Get User Notifications
    try {
      const userNotificationsRes = await axios.get(`${BASE_URL}/api/notifications/user/${userId}`, config);
      logResult('Get User Notifications', true, userNotificationsRes.data);
    } catch (error) {
      logResult('Get User Notifications', false, null, error.response?.data || error.message);
    }

    // 10. Test Mark Notification as Read
    if (notificationId) {
      try {
        const markReadRes = await axios.put(`${BASE_URL}/api/notifications/${notificationId}/read`, {}, config);
        logResult('Mark Notification as Read', true, markReadRes.data);
      } catch (error) {
        logResult('Mark Notification as Read', false, null, error.response?.data || error.message);
      }
    }

    // 11. Test Reading Progress Creation
    if (bookId) {
      try {
        const progressRes = await axios.post(`${BASE_URL}/api/reading-progress`, {
          user: userId,
          book: bookId,
          pagesRead: 50,
          dateRead: new Date().toISOString()
        }, config);
        logResult('Create Reading Progress', true, progressRes.data);
      } catch (error) {
        logResult('Create Reading Progress', false, null, error.response?.data || error.message);
      }
    }

    // 12. Test Get User Reading Progress
    try {
      const userProgressRes = await axios.get(`${BASE_URL}/api/reading-progress/user/${userId}`, config);
      logResult('Get User Reading Progress', true, userProgressRes.data);
    } catch (error) {
      logResult('Get User Reading Progress', false, null, error.response?.data || error.message);
    }

    console.log(`\n${colors.blue}=== API TESTING COMPLETE ===${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
  }
}

// Run the tests
testAllApis(); 