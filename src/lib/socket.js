import openSocket from 'socket.io-client';

export const socket = openSocket(__API_ORIGIN__);

const subscribeToMessages = (callback) => {
  socket.on('message', message => callback(null, message));
  socket.emit('subscribeToMessages');
}

const subscribeToRegister = (callback) => {
  socket.on('register', user => callback(null, user));
  socket.emit('subscribeToRegister');
}

const subscribeToLogout = (callback) => {
  socket.on('logout', user => callback(null, user));
  socket.emit('subscribeToLogout');
}

const subscribeToIsOnline = (callback) => {
  socket.on('isOnline', user => callback(null, user));
  socket.emit('subcribeToIsOnline');
}

export default {
  subscribeToMessages,
  subscribeToRegister,
  subscribeToLogout,
  subscribeToIsOnline,
}