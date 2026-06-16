import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

let socket = null;

export const connectSocket = (token) => {
  if (socket?.connected) return;

  socket = io(BASE_URL, {
    path: '/socket.io',
    auth: { token },
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    transports: ['websocket', 'polling'],
  });

  // Before each reconnect attempt, pull the freshest token from localStorage.
  // Without this, socket.io retries with the original token from connectSocket(),
  // which may have expired 15+ minutes ago, causing reconnects to be rejected.
  socket.io.on('reconnect_attempt', () => {
    const freshToken = localStorage.getItem('token');
    if (freshToken) socket.auth = { token: freshToken };
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
