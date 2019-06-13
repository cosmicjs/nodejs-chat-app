// import our js libraries
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const session = require('express-session');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const twilioNotificatations = require('./server/twilioNotifications');
const Cosmic = require('cosmicjs');
const api = Cosmic();
const bucket = api.bucket({
  slug: 'cosmic-messenger',
  read_key: process.env.__COSMIC_READ_KEY__,
  write_key: process.env.__COSMIC_WRITE_KEY__
});

// configure our application level middleware
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}
app.use('/', express.static('./dist'));
app.use('/api', bodyparser.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.__API_SECRET__,
  resave: true,
  saveUninitialized: true,
}))
const PORT = process.env.PORT || 3000;

/**
 * Socket configuration for client events
 * 
 * Events:
 *  @register - should emit when a user registers a username.
 *  @logout - should emit when a new user logs out.
 *  @message - should emit a message to users when users send a message.
 * 
 */
io.on('connection', function (socket) {
  socket.on('register', function (user) {
    io.emit('register', user);
  });

  socket.on('logout', function (user) {
    io.emit('logout', user);
  });

  socket.on('message', function (msg) {
    io.emit('message', msg);
  });
});

/**
 * 
 * Below we are configuring our server routes for creating
 * resources on Cosmic JS and serving our React Application
 * 
 * Login Route that returns a user object
 */
app.post('/api/register', async function (req, response) {
  const { username } = req.body;
  if (!username) {
    response.status(400).send({ 'message': '/api/register error, no userName on request body' });
    return;
  }
  try {
    let user = await bucket.getObjects({ type: 'users', filters: { title: username } });
    if (user.status !== 'empty' && user.objects.find(i => i.title === username)) {
      response.status(400).send({ "message": "user is already logged in" });
      return;
    }
    user = await bucket.addObject({ title: username, type_slug: 'users' });
    req.session.user_id = user.object._id;
    response.status(200)
      .cookie('session_user', user.object._id)
      .send({ _id: user.object._id, name: user.object.title, created_at: user.object.created_at });
    return;
  } catch (err) {
    response.status(400).send({ "message": 'Error registering username', "error": err });
    return;
  }
});

/**
 * Logout route that destroys user object
 */
app.post('/api/logout', async function (req, response) {
  const { username } = req.body;
  if (!username) {
    response.status(400).send('No username');
  }
  if (req.session) {
    req.session.destroy();
  }
  try {
    let deleteUserData = await bucket.deleteObject({
      slug: username
    });
    response.status(204).send(deleteUserData);
    return;
  } catch (err) {
    response.status(400).send({ "message": "unable to remove user" });
  }
});

app.post('/api/message', twilioNotificatations.notifyOnMessage, async function (req, response) {
  const { title, content } = req.body;
  if (!req.session.user_id) {
    response.status(401).send({ "message": "Unauthorized, no session data present" });
    return;
  }

  try {
    let message = await bucket.addObject({
      title: title,
      type_slug: "messages",
      content: content,
      metafields: [
        { "key": "user_id", "type": "text", "value": req.session.user_id }
      ],
    });
    response.status(200).send(message);
  } catch (err) {
    response.status(400).send({ "message": "Error creating message", "error": err });
  }
})

/**
 * Serves our entry file for our compiled react applications
 */
app.get(['/', '/:username'], (req, res) => {
  if (req.cookies.session_user) {
    req.session.user_id = req.cookies.session_user;
  }
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

http.listen(PORT, () => {
  console.log(`Cosmic Messenger listening on port : ${PORT}`);
});