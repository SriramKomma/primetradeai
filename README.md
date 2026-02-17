# PrimeTask - Frontend Developer Internship Assignment

Fully functional, scalable MERN stack application built for the Frontend Developer Internship Assignment.

## 📌 Project Overview

This project implements a full-stack task management dashboard with robust authentication, search/filter capabilities, and a responsive UI.

### 🌟 Key Features

**Frontend (React + TailwindCSS)**:
- **Responsive Dashboard**: Stats overview and task management.
- **Task Management**: Create, Read, Update, Delete (CRUD) tasks.
- **Search & Filter**: Real-time search by title and filter by status (Pending, In-Progress, Completed).
- **Authentication**: JWT-based Login & Registration with protected routes.
- **Profile Management**: View and update user profile.
- **Validation**: Client-side form validation and error handling.

**Backend (Node.js + Express + MongoDB)**:
- **Secure API**: JWT Authentication middleware and bcrypt password hashing.
- **RESTful Endpoints**: Structured routes for Auth and Tasks.
- **Validation**: Server-side request validation using `express-validator`.
- **Scalable Architecture**: Controller-Service-Repository pattern.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or Atlas URI)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd primetradeai
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env 
   # Update MONGO_URI in .env if needed
   
   # Start Server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

The application will be available at `https://primetradeai-dowf.vercel.app` (or locally at `http://localhost:3000`).

## 📚 Documentation

- **API Documentation**: Detailed endpoint descriptions are available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).
- **Scaling Strategy**: Architecture and scaling considerations are detailed in [SCALING_NOTES.md](./SCALING_NOTES.md).

## 🧪 Testing & Verification

We have included verification scripts to test the backend functionality:
```bash
# In backend directory
node verify-auth.js   # Test Authentication flows
node verify-tasks.js  # Test CRUD operations
```

## 📂 Project Structure

```
primetradeai/
├── backend/                 # Express.js Server
│   ├── config/             # DB Connection
│   ├── controllers/        # Request Handlers
│   ├── middleware/         # Auth & Error Middleware
│   ├── models/             # Mongoose Models
│   └── routes/             # API Routes
├── frontend/               # React Application
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI Components
│       ├── context/        # Auth State Management
│       ├── pages/          # Application Pages
│       └── services/       # API Service Functions
├── API_DOCUMENTATION.md    # API Specs
└── SCALING_NOTES.md        # Architecture Decisions
```

## 🛡️ Security

- **Password Hashing**: Bcrypt
- **Authentication**: JWT (JSON Web Tokens)
- **Sanitization**: Input validation via express-validator

## 📦 Tech Stack
- **Frontend**: React.js, TailwindCSS, Axios, React Router v6
- **Backend**: Node.js, Express.js, Mongoose, JWT
- **Database**: MongoDB
