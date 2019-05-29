const express = require('express');
const io = require('socket.io');
const PORT = process.env.PORT || 3000

const { renderToString } = require('react-dom/server');
const app = express();

app.use(express.static(__dirname + '/dist'));

app.get('*', (req, res) => {
  // Render our react application
  res.sendFile('./dist/index.html');
});

app.listen(PORT, () => {
  console.log(`Cosmic Messenger listening at port : ${PORT}`)
});