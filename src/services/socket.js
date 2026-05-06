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
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
