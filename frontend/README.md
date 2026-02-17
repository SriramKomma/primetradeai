# PrimeTask — Scalable Task Management Application

A full-stack MERN (MongoDB, Express, React, Node.js) task management application with JWT authentication, user profile management, and CRUD operations.

## Features

- **Authentication:** Register, Login, Logout with JWT-based token auth
- **Profile Management:** View and update user profile
- **Task CRUD:** Create, Read, Update, Delete tasks
- **Search & Filter:** Search tasks by title, filter by status
- **Protected Routes:** Dashboard and Profile require authentication
- **Responsive Design:** TailwindCSS with mobile-first responsive layout
- **Form Validation:** Client-side and server-side validation
- **Security:** Password hashing (bcrypt), Helmet headers, rate limiting, CORS, input validation

## Tech Stack

| Layer      | Technology                              |
|------------|------------------------------------------|
| Frontend   | React 19, React Router 7, TailwindCSS 3 |
| Backend    | Express 5, Node.js                       |
| Database   | MongoDB with Mongoose 9                  |
| Auth       | JWT (jsonwebtoken), bcryptjs             |
| Security   | Helmet, express-rate-limit, CORS         |
| Validation | express-validator (server), custom (client) |

## Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers (auth, tasks)
│   ├── middleware/       # Auth, error handling, validation
│   ├── models/          # Mongoose schemas (User, Task)
│   ├── routes/          # Express route definitions
│   └── server.js        # App entry point
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── context/     # React Context (Auth)
│       ├── hooks/       # Custom hooks (useAuth)
│       ├── pages/       # Page components (Dashboard, Profile, Login, Register)
│       └── services/    # API service layer (axios)
├── API_DOCUMENTATION.md # Full API reference
└── SCALING_NOTES.md     # Production scaling strategy
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/primetask
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev    # Development with hot reload
npm start      # Production
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

Start the frontend:

```bash
npm start
```

The app will be available at `http://localhost:3000`.

## API Overview

See [API_DOCUMENTATION.md](../API_DOCUMENTATION.md) for complete API reference.

| Method | Endpoint             | Description          | Auth |
|--------|----------------------|----------------------|------|
| POST   | /api/auth/register   | Register user        | No   |
| POST   | /api/auth/login      | Login user           | No   |
| GET    | /api/auth/me         | Get current user     | Yes  |
| PUT    | /api/auth/profile    | Update profile       | Yes  |
| GET    | /api/tasks           | Get all tasks        | Yes  |
| POST   | /api/tasks           | Create task          | Yes  |
| PUT    | /api/tasks/:id       | Update task          | Yes  |
| DELETE | /api/tasks/:id       | Delete task          | Yes  |

## Scaling Notes

See [SCALING_NOTES.md](../SCALING_NOTES.md) for production scaling strategy.
