var twilioClient = require('./twilioClient');
const admins = require('./config').adminNumbers;

function formatMessage(user, messageText) {
  return `Message from ${user}: ${messageText}`;
};

exports.notifyOnMessage = function (req, res, next) {
  if (req.session) {
    const { title, content } = req.body;
    admins.forEach(function (admin) {
      var messageToSend = formatMessage(title, content);
      twilioClient.sendSms(admin.phoneNumber, messageToSend);
    });
  }
  next();
};