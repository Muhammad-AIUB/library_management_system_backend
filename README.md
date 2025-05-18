# 📚 Library Management System Backend

A comprehensive API backend for a Library Management System designed to track reading progress, provide personalized book recommendations, and analyze user reading habits through interactive dashboards.

> **API Reference**: This backend provides [51 fully documented endpoints](#-api-documentation) across 10 feature domains with complete CRUD operations. [Jump to API Documentation](#-api-documentation)

## 🌟 Key Features

### 🔒 Authentication System
- Secure user registration with email validation
- Password hashing with bcrypt for security
- JWT token-based authentication
- Protected routes with middleware
- Role-based access control (User and Admin roles)
- Persistent sessions with token expiration
- Secure user profile management

### 📊 Reading Progress Tracker
- Dynamic progress tracking for each book
- Reading speed calculation (pages per minute)
- Time spent tracking per reading session
- Estimated completion time calculation
- Progress visualization data for charts
- Reading session history

### 📈 Data Analytics Dashboard
- Visual data for reading patterns, completed books, and top genres
- Daily, weekly, and monthly reading statistics
- Genre distribution analytics with chart-ready data
- Reading time heatmap (when users read the most)
- Time-of-day and day-of-week reading pattern analysis

### 🔔 Smart Notifications System
- Reading reminders based on reading frequency and habits
- Goal deadline approaching notifications
- Book abandonment reminders based on user reading patterns
- Priority-based notification system
- Reference links to relevant books and goals

### 🎯 Custom Reading Goals
- Multiple goal types (books, pages, reading time)
- Flexible duration options (daily, weekly, monthly, yearly, custom)
- Streak tracking for daily goals
- Progress calculation and visualization
- Automatic goal status updates (completed, failed, active)

### 🔍 Advanced Search & Filters
- Multi-criteria search with filters for genre, author, reading status
- Tag-based search functionality
- Reading status filtering (in progress, completed, not started)
- Sort by various criteria (rating, publish date, etc)
- Integration with Google Books for extended search

### 💡 Personalized Recommendations
- Intelligent recommendations based on reading history and preferences
- Genre and author-based categorization
- Popular books recommendations
- Recommendation quality feedback system
- Automatic refreshing of recommendations based on new reading data

### 📝 Book Summary & Notes Section
- User-created summaries and notes for each book
- Organization of notes by book sections
- Rich text support for formatting
- Search functionality within notes

### 🔄 External API Integration
- Google Books API for book data, cover images, and author details
- Smart handling with or without API key
- Book import functionality with one click

### 🌙 Dark Mode & Custom Themes
- Support for light and dark themes
- Custom color schemes
- User preference persistence

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.x or later)
- MongoDB (v4.x or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/library-management-system-backend.git
cd library-management-system-backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/library_management_system
# Or your MongoDB Atlas Connection String

# Server Port
PORT=5000

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_key

# Google Books API Key (optional)
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

4. Start the server
```bash
npm start
```

The server will run on `http://localhost:5000`.

## 📝 API Documentation

This section provides a quick reference for all API endpoints. For detailed request/response examples, see the "Complete API Reference" section below.

### Features Overview

| Feature | Description | Endpoints |
|---------|-------------|-----------|
| 🔐 Authentication | User registration and login with JWT | 3 endpoints |
| 👤 User Management | CRUD operations for users | 4 endpoints |
| 📖 Books | Book management with search and import | 7 endpoints |
| 📊 Reading Progress | Track reading sessions and progress | 6 endpoints |
| 🎯 Reading Goals | Set and track reading goals | 9 endpoints |
| 📝 Book Notes | Add notes to books | 4 endpoints |
| 💡 Recommendations | Get personalized book recommendations | 3 endpoints |
| 🔔 Notifications | System notifications and reminders | 8 endpoints |
| 📈 Analytics | Reading statistics and visualizations | 4 endpoints |
| 🌙 Theme | User interface theme preferences | 3 endpoints |

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get authentication token
- `GET /api/auth/profile` - Get current user profile (protected route)

### User Management Routes
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user details
- `DELETE /api/users/:id` - Delete user (admin only)

### Books Routes
- `POST /api/books` - Create a new book
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book by ID
- `GET /api/books/search` - Advanced search with filters
- `PUT /api/books/:id` - Update book details
- `DELETE /api/books/:id` - Delete book
- `POST /api/books/import` - Import book from Google Books

### Reading Progress Routes
- `POST /api/reading-progress` - Create reading progress
- `GET /api/reading-progress/user/:userId` - Get user's reading progress
- `GET /api/reading-progress/:userId/:bookId` - Get progress for specific book
- `GET /api/reading-progress/stats/:userId` - Get reading statistics
- `PUT /api/reading-progress/:id` - Update reading progress
- `DELETE /api/reading-progress/:id` - Delete reading progress

### Reading Goals Routes
- `POST /api/reading-goals` - Create a reading goal
- `GET /api/reading-goals/user/:userId` - Get user's reading goals
- `GET /api/reading-goals/active/:userId` - Get active reading goals
- `GET /api/reading-goals/:id` - Get reading goal by ID
- `GET /api/reading-goals/stats/:userId` - Get user goal statistics
- `PUT /api/reading-goals/:id` - Update reading goal
- `POST /api/reading-goals/progress` - Update goal progress
- `PUT /api/reading-goals/abandon/:goalId` - Abandon reading goal
- `DELETE /api/reading-goals/:id` - Delete reading goal

### Book Notes Routes
- `POST /api/book-notes` - Create a book note
- `GET /api/book-notes/book/:bookId` - Get notes for a specific book
- `PUT /api/book-notes/:id` - Update a note
- `DELETE /api/book-notes/:id` - Delete a note

### Recommendations Routes
- `GET /api/recommendation/generate/:userId` - Generate personalized recommendations
- `GET /api/recommendation/:userId` - Get user's recommendations
- `POST /api/recommendation/rate` - Rate recommendation quality

### Notifications Routes
- `POST /api/notifications` - Create a notification
- `GET /api/notifications/user/:userId` - Get user notifications
- `GET /api/notifications/unread/:userId` - Get unread notification count
- `GET /api/notifications/:id` - Get single notification
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/user/:userId/read-all` - Mark all notifications as read
- `POST /api/notifications/generate-reminders/:userId` - Generate reading reminders
- `DELETE /api/notifications/:id` - Delete notification

### Analytics Dashboard Routes
- `GET /api/analytics/dashboard/overview/:userId` - Get dashboard overview
- `GET /api/analytics/dashboard/progress/:userId` - Get reading progress analysis
- `GET /api/analytics/dashboard/genre/:userId` - Get genre analysis
- `GET /api/analytics/dashboard/time/:userId` - Get reading time analysis

### Theme Routes
- `POST /api/theme/update` - Update theme
- `GET /api/theme/:userId` - Get user theme
- `PUT /api/theme/reset/:userId` - Reset theme to default

## 📘 Complete API Reference

This section provides a comprehensive reference for all API endpoints in the Library Management System, with full CRUD operations for each feature.

### 🔐 Authentication API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and get authentication token | No |
| `GET` | `/api/auth/profile` | Get user profile | Yes |

#### Register User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123!"
}
```

**Successful Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "User"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123!"
}
```

**Successful Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "User"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get User Profile
```
GET /api/auth/profile
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Successful Response (200):**
```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "User",
  "createdAt": "2023-01-01T12:00:00.000Z",
  "updatedAt": "2023-01-01T12:00:00.000Z"
}
```

### 👤 User Management API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| `GET` | `/api/users` | Get all users | Yes (Admin) |
| `GET` | `/api/users/:id` | Get user by ID | Yes |
| `PUT` | `/api/users/:id` | Update user details | Yes |
| `DELETE` | `/api/users/:id` | Delete user | Yes (Admin) |

#### Get All Users (Admin Only)
```
GET /api/users
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Successful Response (200):**
```json
{
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "User"
    },
    {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "Admin"
    }
  ]
}
```

#### Get User by ID
```
GET /api/users/:id
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Successful Response (200):**
```json
{
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "User"
  }
}
```

#### Update User
```
PUT /api/users/:id
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "bio": "Book enthusiast and avid reader",
  "profilePicture": "https://example.com/profile.jpg"
}
```

**Successful Response (200):**
```json
{
  "message": "User updated successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "bio": "Book enthusiast and avid reader",
    "profilePicture": "https://example.com/profile.jpg",
    "role": "User"
  }
}
```

#### Delete User (Admin Only)
```
DELETE /api/users/:id
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Successful Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

### 📖 Books API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| `POST` | `/api/books` | Create a new book | Yes |
| `GET` | `/api/books` | Get all books | Yes |
| `GET` | `/api/books/:id` | Get book by ID | Yes |
| `GET` | `/api/books/search` | Search books with filters | Yes |
| `PUT` | `/api/books/:id` | Update book details | Yes |
| `DELETE` | `/api/books/:id` | Delete book | Yes |
| `POST` | `/api/books/import` | Import book from Google Books | Yes |

#### Create Book
```
POST /api/books
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "title": "To Kill a Mockingbird",
  "author": "Harper Lee",
  "genre": "Fiction",
  "pages": 281,
  "description": "The story of young girl confronting the deep-seated racism in her community"
}
```

**Successful Response (201):**
```json
{
  "message": "Book created successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c87",
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "genre": "Fiction",
    "pages": 281,
    "description": "The story of young girl confronting the deep-seated racism in her community"
  }
}
```

#### Get All Books
```
GET /api/books
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of books per page
- `sort` (optional): Field to sort by

**Successful Response (200):**
```json
{
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c87",
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "genre": "Fiction",
      "pages": 281
    },
    {
      "_id": "60d21b4667d0d8992e610c88",
      "title": "1984",
      "author": "George Orwell",
      "genre": "Science Fiction",
      "pages": 328
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "pages": 1,
    "limit": 10
  }
}
```

#### Get Book by ID
```
GET /api/books/:id
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Successful Response (200):**
```json
{
  "data": {
    "_id": "60d21b4667d0d8992e610c87",
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "genre": "Fiction",
    "pages": 281,
    "description": "The story of young girl confronting the deep-seated racism in her community"
  }
}
```

#### Search Books
```
GET /api/books/search
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
- `q` (optional): Search query
- `genre` (optional): Filter by genre
- `author` (optional): Filter by author
- `minPages` (optional): Minimum number of pages
- `maxPages` (optional): Maximum number of pages
- `sort` (optional): Field to sort by

**Successful Response (200):**
```json
{
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c87",
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "genre": "Fiction",
      "pages": 281
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "pages": 1,
    "limit": 10
  }
}
```

#### Update Book
```
PUT /api/books/:id
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "title": "To Kill a Mockingbird (Revised Edition)",
  "pages": 290,
  "coverImage": "https://example.com/book-cover.jpg"
}
```

**Successful Response (200):**
```json
{
  "message": "Book updated successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c87",
    "title": "To Kill a Mockingbird (Revised Edition)",
    "author": "Harper Lee",
    "genre": "Fiction",
    "pages": 290,
    "coverImage": "https://example.com/book-cover.jpg",
    "description": "The story of young girl confronting the deep-seated racism in her community"
  }
}
```

#### Delete Book
```
DELETE /api/books/:id
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Successful Response (200):**
```json
{
  "message": "Book deleted successfully"
}
```

#### Import Book from Google Books
```
POST /api/books/import
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "googleBooksId": "NGR2AAAAMAAJ"
}
```

**Successful Response (201):**
```json
{
  "message": "Book imported successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c89",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "pages": 180,
    "description": "A story of wealth, love and the American Dream",
    "googleBooksId": "NGR2AAAAMAAJ",
    "coverImage": "https://books.google.com/books/content?id=NGR2AAAAMAAJ&printsec=frontcover&img=1"
  }
}
```

### 📊 Reading Progress API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| `POST` | `/api/reading-progress` | Create reading progress | Yes |
| `GET` | `/api/reading-progress/user/:userId` | Get user's reading progress | Yes |
| `GET` | `/api/reading-progress/:userId/:bookId` | Get progress for specific book | Yes |
| `GET` | `/api/reading-progress/stats/:userId` | Get reading statistics | Yes |
| `PUT` | `/api/reading-progress/:id` | Update reading progress | Yes |
| `DELETE` | `/api/reading-progress/:id` | Delete reading progress | Yes |

#### Create Reading Progress
```
POST /api/reading-progress
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "user": "60d21b4667d0d8992e610c85",
  "book": "60d21b4667d0d8992e610c87",
  "pagesRead": 50,
  "minutesRead": 30,
  "dateRead": "2023-05-20T15:30:00.000Z",
  "notes": "Starting to get into the story now"
}
```

**Successful Response (201):**
```json
{
  "message": "Reading progress recorded successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c90",
    "user": "60d21b4667d0d8992e610c85",
    "book": "60d21b4667d0d8992e610c87",
    "pagesRead": 50,
    "minutesRead": 30,
    "dateRead": "2023-05-20T15:30:00.000Z",
    "notes": "Starting to get into the story now",
    "createdAt": "2023-05-20T15:35:00.000Z"
  }
}
```

#### Get User's Reading Progress
```
GET /api/reading-progress/user/:userId
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Successful Response (200):**
```json
{
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c90",
      "user": "60d21b4667d0d8992e610c85",
      "book": {
        "_id": "60d21b4667d0d8992e610c87",
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee"
      },
      "pagesRead": 50,
      "minutesRead": 30,
      "dateRead": "2023-05-20T15:30:00.000Z",
      "progress": 17.79 // Percentage
    }
  ]
}
```

#### Get Progress for Specific Book
```
GET /api/reading-progress/:userId/:bookId
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Successful Response (200):**
```json
{
  "data": {
    "book": {
      "_id": "60d21b4667d0d8992e610c87",
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "pages": 281
    },
    "progress": {
      "pagesRead": 50,
      "percentageComplete": 17.79,
      "minutesRead": 30,
      "readingSpeed": 1.67, // Pages per minute
      "estimatedTimeToComplete": 138, // Minutes
      "sessions": [
        {
          "_id": "60d21b4667d0d8992e610c90",
          "pagesRead": 50,
          "minutesRead": 30,
          "dateRead": "2023-05-20T15:30:00.000Z"
        }
      ]
    }
  }
}
```

#### Get Reading Statistics
```
GET /api/reading-progress/stats/:userId
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
- `period` (optional): 'day', 'week', 'month', 'year'

**Successful Response (200):**
```json
{
  "data": {
    "totalBooks": 1,
    "totalPagesRead": 50,
    "totalMinutesRead": 30,
    "averageReadingSpeed": 1.67,
    "booksInProgress": 1,
    "booksCompleted": 0,
    "mostReadGenre": "Fiction",
    "timeByDay": {
      "Monday": 0,
      "Tuesday": 30,
      "Wednesday": 0,
      "Thursday": 0,
      "Friday": 0,
      "Saturday": 0,
      "Sunday": 0
    }
  }
}
```

#### Update Reading Progress
```
PUT /api/reading-progress/:id
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "pagesRead": 75,
  "minutesRead": 45,
  "notes": "Really enjoying the character development"
}
```

**Successful Response (200):**
```json
{
  "message": "Reading progress updated successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c90",
    "user": "60d21b4667d0d8992e610c85",
    "book": "60d21b4667d0d8992e610c87",
    "pagesRead": 75,
    "minutesRead": 45,
    "dateRead": "2023-05-20T15:30:00.000Z",
    "notes": "Really enjoying the character development"
  }
}
```

#### Delete Reading Progress
```
DELETE /api/reading-progress/:id
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Successful Response (200):**
```json
{
  "message": "Reading progress deleted successfully"
}
```

### 🎯 Reading Goals API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| `POST` | `/api/reading-goals` | Create a reading goal | Yes |
| `GET` | `/api/reading-goals/user/:userId` | Get user's reading goals | Yes |
| `GET` | `/api/reading-goals/active/:userId` | Get active reading goals | Yes |
| `GET` | `/api/reading-goals/:id` | Get reading goal by ID | Yes |
| `GET` | `/api/reading-goals/stats/:userId` | Get goal statistics | Yes |
| `PUT` | `/api/reading-goals/:id` | Update reading goal | Yes |
| `POST` | `/api/reading-goals/progress` | Update goal progress | Yes |
| `PUT` | `/api/reading-goals/abandon/:goalId` | Abandon reading goal | Yes |
| `DELETE` | `/api/reading-goals/:id` | Delete reading goal | Yes |

#### Create Reading Goal
```
POST /api/reading-goals
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "user": "60d21b4667d0d8992e610c85",
  "type": "books",
  "targetBooks": 12,
  "duration": "yearly",
  "startDate": "2023-01-01T00:00:00.000Z"
}
```

**Successful Response (201):**
```json
{
  "message": "Reading goal created successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c91",
    "user": "60d21b4667d0d8992e610c85",
    "type": "books",
    "targetBooks": 12,
    "duration": "yearly",
    "startDate": "2023-01-01T00:00:00.000Z",
    "endDate": "2023-12-31T23:59:59.999Z",
    "status": "active",
    "progress": 0,
    "createdAt": "2023-01-01T12:00:00.000Z"
  }
}
```

### 🔔 Notifications API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| `POST` | `/api/notifications` | Create a notification | Yes |
| `GET` | `/api/notifications/user/:userId` | Get user notifications | Yes |
| `GET` | `/api/notifications/unread/:userId` | Get unread notification count | Yes |
| `GET` | `/api/notifications/:id` | Get single notification | Yes |
| `PUT` | `/api/notifications/:id/read` | Mark notification as read | Yes |
| `PUT` | `/api/notifications/user/:userId/read-all` | Mark all notifications as read | Yes |
| `POST` | `/api/notifications/generate-reminders/:userId` | Generate reading reminders | Yes |
| `DELETE` | `/api/notifications/:id` | Delete notification | Yes |

### 💡 Recommendations API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| `GET` | `/api/recommendation/generate/:userId` | Generate personalized recommendations | Yes |
| `GET` | `/api/recommendation/:userId` | Get user's recommendations | Yes |
| `POST` | `/api/recommendation/rate` | Rate recommendation quality | Yes |

### 📈 Analytics Dashboard API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| `GET` | `/api/analytics/dashboard/overview/:userId` | Get dashboard overview | Yes |
| `GET` | `/api/analytics/dashboard/progress/:userId` | Get reading progress analysis | Yes |
| `GET` | `/api/analytics/dashboard/genre/:userId` | Get genre analysis | Yes |
| `GET` | `/api/analytics/dashboard/time/:userId` | Get reading time analysis | Yes |

### 📝 Book Notes API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| `POST` | `/api/book-notes` | Create a book note | Yes |
| `GET` | `/api/book-notes/book/:bookId` | Get notes for a specific book | Yes |
| `PUT` | `/api/book-notes/:id` | Update a note | Yes |
| `DELETE` | `/api/book-notes/:id` | Delete a note | Yes |

### 🌙 Theme API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| `POST` | `/api/theme/update` | Update theme | Yes |
| `GET` | `/api/theme/:userId` | Get user theme | Yes |
| `PUT` | `/api/theme/reset/:userId` | Reset theme to default | Yes |

## 🏗️ Project Structure

```
library-management-system-backend/
├── controllers/         # Route controllers
├── models/              # MongoDB schema models
├── routes/              # API routes
├── services/            # External service integrations
├── middleware/          # Express middleware
├── .env                 # Environment variables
├── .gitignore           # Git ignore file
├── server.js            # Entry point
└── package.json         # Dependencies and scripts
```

## 💡 Models Description

### User Model
The central entity that represents a user of the system.

### Book Model
Stores book information like title, author, description, etc.

### ReadingProgress Model
Tracks user reading progress for each book:
- Reading speed metrics
- Completion percentage
- Reading session logs
- Time estimates

### ReadingGoal Model
Manages user reading goals:
- Multiple goal types (books, pages, time)
- Goal duration settings
- Progress tracking
- Streak management

### Recommendation Model
Stores and manages user book recommendations:
- Books recommended to user
- Recommendation categories
- User feedback on recommendations

### Notification Model
Handles system notifications:
- Custom notification types
- Priority levels
- Reference to related entities (books, goals)
- Read status tracking

### UserSettings/Theme Model
Manages user preferences:
- Theme settings (light/dark)
- Custom colors

## 📡 Third-Party Integrations

### Google Books API
Used to fetch book information, covers, and metadata:
- Book search
- Book details retrieval
- Book import functionality

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```

### Testing
```bash
# Run unit tests with Jest
npm test

# Run tests with coverage report
npm run test:coverage
```

### API Testing with Newman
The project includes API tests using Postman and Newman. These tests verify all API endpoints including the authentication system.

#### Prerequisites for API Testing
- Newman CLI (installed globally or as a dev dependency)
- Newman HTML reporter for detailed reports

#### Running API Tests
```bash
# Run tests with basic CLI output
npm run test:newman

# Run tests with detailed HTML report
npm run test:newman:report

# Run tests with the Node.js script (includes detailed console output)
npm run test:api
```

#### Windows Users
Windows users can run the tests using:
```
.\run-newman-tests.bat
# or 
powershell -ExecutionPolicy Bypass -File .\run-newman-tests.ps1
```

#### Test Coverage
The API tests cover:
- User authentication (registration, login, profile)
- Book management
- Reading progress tracking
- Reading goals
- Notifications
- And other features

#### HTML Reports
After running the tests with the HTML reporter, you can find the detailed reports in the `newman-reports` directory.

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- Your Name - Initial work

---

Developed as a comprehensive Library Management System designed to track reading progress, provide personalized book recommendations, and analyze user reading habits through interactive dashboards.

## 📄 Authentication Flow

### User Registration
1. Client submits name, email, and password to `/api/auth/register`
2. Server validates input and checks if email already exists
3. Password is hashed for security
4. New user is created in database
5. JWT token is generated and returned with user details

### User Login
1. Client submits email and password to `/api/auth/login`
2. Server validates credentials
3. JWT token is generated and returned with user details

### Accessing Protected Routes
1. Client includes JWT token in Authorization header: `Bearer <token>`
2. Server validates token and identifies user
3. If valid, request is processed; if invalid, 401 Unauthorized is returned

### Admin-Only Routes
Some routes are restricted to users with Admin role only. 