# 📚 Library Management System Backend

A comprehensive API backend for a Library Management System designed to track reading progress, provide personalized book recommendations, and analyze user reading habits through interactive dashboards.

## 🌟 Key Features

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

# Google Books API Key (optional)
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

4. Start the server
```bash
npm start
```

The server will run on `http://localhost:5000`.

## 📝 API Documentation

### User Routes
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile/:userId` - Get user profile

### Books Routes
- `POST /api/books` - Create a new book
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book by ID
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/books/search` - Advanced search with filters
- `POST /api/books/import` - Import book from Google Books

### Book Notes Routes
- `POST /api/book-notes` - Create a book note
- `GET /api/book-notes/book/:bookId` - Get notes for a specific book
- `PUT /api/book-notes/:id` - Update a note
- `DELETE /api/book-notes/:id` - Delete a note

### Reading Progress Routes
- `POST /api/reading-progress/track` - Track reading progress
- `GET /api/reading-progress/:userId/:bookId` - Get progress for a specific book
- `GET /api/reading-progress/user/:userId` - Get all reading progress for a user
- `GET /api/reading-progress/stats/:userId` - Get reading statistics

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

### Recommendations Routes
- `GET /api/recommendation/generate/:userId` - Generate personalized recommendations
- `GET /api/recommendation/:userId` - Get user's recommendations
- `POST /api/recommendation/rate` - Rate recommendation quality

### Analytics Dashboard Routes
- `GET /api/analytics/dashboard/overview/:userId` - Get dashboard overview
- `GET /api/analytics/dashboard/progress/:userId` - Get reading progress analysis
- `GET /api/analytics/dashboard/genre/:userId` - Get genre analysis
- `GET /api/analytics/dashboard/time/:userId` - Get reading time analysis

### Notifications Routes
- `POST /api/notifications` - Create a notification
- `GET /api/notifications/user/:userId` - Get user notifications
- `GET /api/notifications/unread/:userId` - Get unread notification count
- `GET /api/notifications/:id` - Get single notification
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/user/:userId/read-all` - Mark all notifications as read
- `POST /api/notifications/generate-reminders/:userId` - Generate reading reminders
- `DELETE /api/notifications/:id` - Delete notification

### Theme Routes
- `POST /api/theme/update` - Update theme
- `GET /api/theme/:userId` - Get user theme
- `PUT /api/theme/reset/:userId` - Reset theme to default

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
npm test
```

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- Your Name - Initial work

---

Developed as a comprehensive Library Management System designed to track reading progress, provide personalized book recommendations, and analyze user reading habits through interactive dashboards. 