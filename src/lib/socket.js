import openSocket from 'socket.io-client';

export const socket = openSocket('http://localhost:3000');

const subscribeToMessages = (callback) => {
  socket.on('message', message => callback(null, message));
  socket.emit('subscribeToMessages');
}

const subscribeToRegister = (callback) => {
  socket.on('register', user => callback(null, user));
  socket.emit('subscribeToRegister');
}

export default {
  subscribeToMessages,
  subscribeToRegister,
}