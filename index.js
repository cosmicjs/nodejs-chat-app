// import our js libraries
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// configure our application level middleware
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const twilioNotificatations = require("./server/middleware/twilioNotifications");
const { isUserRequest, isSessionRequest } = require("./server/middleware/auth");
if (process.env.NODE_ENV === "development") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}
app.use("/", express.static("./dist"));
app.use("/api", bodyparser.json());
app.use(cookieparser());
app.use(
  session({
    secret: process.env.__API_SECRET__,
    resave: true,
    saveUninitialized: true
  })
);
const PORT = process.env.PORT || 3000;

const {
  handleUserConnection,
  handleRegistration,
  handleLogout
} = require("./server/controller/user");
const { handleMessage } = require("./server/controller/message");

/**
 * Socket configuration for client events
 *
 * Events: comments
 *  @register - emits when a user registers a username.
 *  @logout - emits when a new user logs out.
 *  @message - emits a message to users when users send a message.
 *  @connected - emits when a user connects to server
 *  @disconnect -  emits when a user disconnects ends server connection
 *
 */
io.on("connection", function(socket) {
  socket.on("register", function(user) {
    io.emit("register", user);
  });

  socket.on("logout", function(user) {
    io.emit("logout", user);
  });

  socket.on("message", function(msg) {
    io.emit("message", msg);
  });

  socket.on("connected", async function(user) {
    socket.user = user;
    let userConnection = await handleUserConnection(socket.user, true);
    io.emit("isOnline", userConnection);
  });
  socket.on("disconnect", async function() {
    let userConnection = await handleUserConnection(socket.user, false);
    io.emit("isOffline", userConnection);
  });
});

/**
 * Routes to our server controllers
 */
app.post("/api/register", isUserRequest, handleRegistration);
app.post("/api/logout", isUserRequest, handleLogout);
app.post(
  "/api/message",
  isSessionRequest,
  twilioNotificatations.notifyOnMessage,
  handleMessage
);

/**
 * Serves our entry file for our compiled react applications
 */
app.get(["/", "/:username"], (req, res) => {
  if (req.cookies.session_user) {
    req.session.user_id = req.cookies.session_user;
  }
  res.sendFile(path.join(__dirname, "./public", "index.html"));
});

http.listen(PORT, () => {
  console.log(`Cosmic Messenger listening on port : ${PORT}`);
});
