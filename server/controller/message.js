'use strict';
const Cosmic = require('cosmicjs');
const api = Cosmic();
const bucket = api.bucket({
  slug: 'cosmic-messenger',
  read_key: process.env.__COSMIC_READ_KEY__,
  write_key: process.env.__COSMIC_WRITE_KEY__
});

const handleMessage = async (req, res) => {
  const { title, content } = req.body;
  try {
    let message = await bucket.addObject({
      title: title,
      type_slug: "messages",
      content: content,
      metafields: [
        { "key": "user_id", "type": "text", "value": req.session.user_id }
      ],
    });
    res.status(200).send(message);
  } catch (err) {
    res.status(400).send({ "message": "Error creating message", "error": err });
  }
}

module.exports = {
  handleMessage,
}