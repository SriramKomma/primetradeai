import { io } from 'socket.io-client';


let socket;

// Let's assume we want to support both explicit URL or default to window.location
// But adhering to the existing pattern:
const API_URL = process.env.REACT_APP_API_URL ? new URL(process.env.REACT_APP_API_URL).origin : 'http://localhost:5001';

export const initSocket = () => {
  const token = localStorage.getItem('token'); // Get JWT directly from storage

  if (!socket) {
    socket = io(API_URL, {
      auth: { token }, // Send JWT for auth
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Connected to Socket.IO');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    // Listen for broadcast events
    socket.on('taskUpdated', (task) => {
      console.log('Real-time task update:', task);
      // Update your state here (e.g., refresh task list in Redux/Context)
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};