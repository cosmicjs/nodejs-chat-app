'use strict';

const isUserRequest = (req, res, next) => {
  const { username } = req.body;
  if (!username) {
    res.status(400).send({ 'message': '/api/register error, no userName on request body' });
    return;
  }
  next();
}

const isSessionRequest = (req, res, next) => {
  if (!req.session.user_id) {
    res.status(401).send({ "message": "Unauthorized, no session data present" });
    return;
  }
  next();
}

module.exports = {
  isUserRequest,
  isSessionRequest,
}