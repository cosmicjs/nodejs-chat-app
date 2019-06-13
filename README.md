# cosmic-messenger
Full Stack Chat Application with SMS configuration.

## Requirements
- [Cosmic JS Bucket](https://cosmicjs.com/add-bucket?import_bucket=5cf1605916e7ec14adabbb89)
- [Twilio Credentials](https://www.twilio.com/console)

## Installation

`$ touch .env`
### required environment variables
- __API_SECRET__: secret string for signing session cookies
- __API_ORIGIN__: URI for configuring web sockets and making api requests
- __COSMIC_READ_KEY__: Your Cosmic JS read access key
- __COSMIC_WRITE_KEY__: Your Cosmic JS write access key
- __TWILIO_ACCOUNT_SID__: Congifuration variable for your twilio account
- __TWILIO_AUTH_TOKEN__: Twilio authentication token for authentitcation requests to Twilio API.
- __TWILIO_NUMBER__: Twilio Number associated with your Twilio account.
  - NOTE: This should be `15005550006` if using test environment.
- __ADMIN_NUMBER__: A Phone number that will be sent SMS messages when chat message are created.
`$ npm install`
`$ npm run dev`
`$ npm start`