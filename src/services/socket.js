let socket = null;

export const connectSocket = (token) => {
  console.log("Socket connecting with token:", token);
  socket = { connected: true }; // placeholder
};

export const disconnectSocket = () => {
  console.log("Socket disconnected");
  socket = null;
};