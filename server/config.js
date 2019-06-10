require('dotenv').config();
var cfg = {};

cfg.accountSid = process.env.__TWILIO_ACCOUNT_SID__;
cfg.authToken = process.env.__TWILIO_AUTH_TOKEN__;
cfg.sendingNumber = process.env.__TWILIO_NUMBER__;
cfg.adminNumber = process.env.__ADMIN_NUMBER__;

var requiredConfig = [cfg.accountSid, cfg.authToken, cfg.sendingNumber, cfg.adminNumber];
var isConfigured = requiredConfig.every(function (configValue) {
  return configValue || false;
});

if (!isConfigured) {
  var errorMessage =
    'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.';

  throw new Error(errorMessage);
}

// Export configuration object
module.exports = cfg;