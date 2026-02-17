const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const jwt = require('jsonwebtoken'); // Assuming you already have this for auth

// New imports for Socket.IO
const http = require('http');
const { Server } = require('socket.io');

const port = process.env.PORT || 5001;

connectDB();

const app = express();

// Security Middleware
app.use(helmet());

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Error Handler
app.use(errorHandler);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO auth middleware (verify JWT from client)
io.use((socket, next) => {
  const token = socket.handshake.auth.token; // Client sends token in auth
  if (!token) return next(new Error('Authentication error'));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Invalid token'));
    socket.user = decoded; // Attach user data to socket (e.g., user._id)
    next();
  });
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.id}`); // Log authenticated user

  // Join a room (e.g., for user-specific notifications)
  socket.join(`user_${socket.user.id}`);

  // Example: Broadcast task updates
  socket.on('taskUpdate', (task) => {
    // You could validate/save to DB here, but for simplicity, assume it's already saved via API
    io.emit('taskUpdated', task); // Broadcast to all connected clients
    // Or target specific users: io.to(`user_${someUserId}`).emit('taskAssigned', task);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.id}`);
  });
});

// Start server
server.listen(port, () => console.log(`Server + Socket.IO started on port ${port}`));