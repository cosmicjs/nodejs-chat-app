import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:3000');
const subscribeToMessages = (callback) => {
  socket.on('messages', message => callback(null, message));
  socket.emit('subscribeToMessages');
}

export default {
  socket,
  subscribeToMessages,
}