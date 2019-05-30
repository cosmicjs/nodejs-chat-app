const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');

const PORT = process.env.PORT || 3000;
// const { renderToString } = require('react-dom/server');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}
app.use('/', express.static('./dist'));
app.use('/api', bodyparser.json());

app.post('/api/register', function (request, response) {
  const { userName } = request.body;
  if (!userName) {
    response.status(400).send('Error registering username');
  }
  response.status(200).send({
    username: userName,
    loggedInAt: new Date(),
  });
});

app.post('/api/message', function (request, response) {
  // send message to cosmic js
});

app.post('/api/logout', function (request, response) {
  const { userName } = request.body;
  if (!userName) {
    response.status(400).send('Error leaving chat');
  }
  response.status(204).end();
})

app.get(['/', '/:username'], (req, res) => {
  // Render our react application
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Cosmic Messenger listening at port : ${PORT}`);
});