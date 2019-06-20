# Node.js Chat App Update

![image](https://cosmic-s3.imgix.net/774ef9f0-8eda-11e9-a428-fd5043d74680-Cosmic-Messenger.png?w=1000)

Full Stack Chat Application with SMS configuration.

### [View Demo](https://cosmicjs.com/apps/cosmic-messenger)

## Requirements

- [Cosmic JS Bucket](https://cosmicjs.com/add-bucket?import_bucket=5cf1605916e7ec14adabbb89)
- [Twilio Credentials](https://www.twilio.com/console)

## Installation

`$ touch .env`

### required environment variables

- **API_SECRET**: secret string for signing session cookies
- **API_ORIGIN**: URI for configuring web sockets and making api requests
- **COSMIC_READ_KEY**: Your Cosmic JS read access key
- **COSMIC_WRITE_KEY**: Your Cosmic JS write access key
- **TWILIO_ACCOUNT_SID**: Congifuration variable for your twilio account
- **TWILIO_AUTH_TOKEN**: Twilio authentication token for authentitcation requests to Twilio API.
- **TWILIO_NUMBER**: Twilio Number associated with your Twilio account.
  - NOTE: This should be `15005550006` if using test environment.
- **ADMIN_NUMBER**: A Phone number that will be sent SMS messages when chat message are created.
  `$ npm install`
  `$ npm run dev`
  `$ npm start`
