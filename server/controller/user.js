'use strict';
const Cosmic = require('cosmicjs');
const api = Cosmic();
const bucket = api.bucket({
  slug: 'cosmic-messenger',
  read_key: process.env.__COSMIC_READ_KEY__,
  write_key: process.env.__COSMIC_WRITE_KEY__
});

const searchUsers = async (username) => {
  try {
    let user = await bucket.getObjects({
      type: 'users',
      q: username,
    });
    return user
  } catch (err) {
    return {
      "message": "Error fetching cosmic js users",
      "err": err,
    }
  }
}

const addUser = async (username) => {
  try {
    let newUser = await bucket.addObject({ title: username, type_slug: 'users' });
    return newUser;
  } catch (err) {
    return {
      "message": "Error adding cosmic js user",
      "err": err,
    }
  }
}

const handleUserConnection = async (user, isConnected) => {
  try {
    let userConnection = await bucket.editObject({
      slug: user.name.replace(' ', '-').toLowerCase(),
      metafields: [
        {
          "title": 'is_online',
          "key": 'is_online',
          "type": 'text',
          "value": isConnected,
        },
      ],
    });
    return userConnection;
  } catch (err) {
    return {
      "message": "Error updating cosmic js user",
      "err": err,
    }
  }
}

const handleRegistration = async (req, res) => {
  const { username } = req.body;
  let user = await searchUsers(username);

  if (user.objects.length) {
    user = user.objects.find(i => i.title === username);
    if (user.metadata && user.metadata.is_online) {
      res.status(400).send({ "message": "user is already logged in" });
      return;
    }
    res.status(200)
      .cookie('session_user', user._id)
      .send({ _id: user._id, name: user.title, created_at: user.created_at });
    return;
  }
  user = await addUser(username);
  if (user.error) {
    res.status(400).send(user);
    return;
  }
  res.status(200)
    .cookie('session_user', user.object._id)
    .send({ _id: user.object._id, name: user.object.title, created_at: user.object.created_at });
  return;
}

const handleLogout = async (req, res) => {
  const { username } = req.body;
  if (req.session) {
    req.session.destroy();
  }
  try {
    let deleteUserData = await bucket.deleteObject({
      slug: username
    });
    res.status(204).send(deleteUserData);
    return;
  } catch (err) {
    res.status(400).send({ "message": "unable to remove user" });
    return;
  }
}

module.exports = {
  searchUsers,
  addUser,
  handleUserConnection,
  handleRegistration,
  handleLogout,
}