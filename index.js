// import our js libraries
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Cosmic = require('cosmicjs');
const api = Cosmic();
const bucket = api.bucket({
  slug: 'cosmic-messenger',
  read_key: process.env.__COSMIC_READ_KEY__,
  write_key: process.env.__COSMIC_WRITE_KEY__
})


// configure our application level middleware
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}
app.use('/', express.static('./dist'));
app.use('/api', bodyparser.json());
const PORT = process.env.PORT || 3000;

/**
 * 
 * Below we are configuring our server routes for creating
 * resources on Cosmic JS and serving our React Application
 * 
 * Login Route that returns a user object
 */
app.post('/api/register', async function (request, response) {
  const { userName } = request.body;
  if (!userName) {
    response.status(400).send('Error registering username');
  }
  try {
    let user = await bucket.getObjects({ type: 'users', filters: { title: userName } });
    if (user.status !== 'empty') {
      response.status(400).send({ "message": "user is already logged in" });
      return;
    }
    user = await bucket.addObject({ title: userName, type_slug: 'users' });
    response.status(200).send({ _id: user.object._id, name: user.object.title, created_at: user.object.created_at });
    return;
  } catch (err) {
    console.log(err);
    response.status(400).send({ "message": 'Error registering username', "error": err });
    return;
  }
});

/** 
 * Creates a message
 */
app.post('/api/message', function (request, response) {
  // send message to cosmic js
});


/**
 * Logout route that destroys user object
 */
app.post('/api/logout', function (request, response) {
  const { userName } = request.body;
  if (!userName) {
    response.status(400).send('Error leaving chat');
  }
  response.status(204).end();
})

/**
 * Serves our entry file for our compiled react applications
 */
app.get(['/', '/:username'], (req, res) => {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Cosmic Messenger listening at port : ${PORT}`);
});