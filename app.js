const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");

const app = express();
require("dotenv").config();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // or the specific origin you want to allow
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 200,
  })
);

// mongoose
const mongoUrl = process.env.mongo_url;
main()
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoUrl);
}

//session
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // This means the cookie will only be sent over HTTPS.
      expires: 60 * 1000,
    },
  })
);

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//demouser
// app.get("/demouser", (req, res) => {
//   let fakeUser = new User({ username: "demo", fullname: "Demo User" });
//   User.register(fakeUser, "demo");
//   console.log(fakeUser);
//   res.send("Hello this is demouser");
// });

//root
app.get("/", (req, res) => {
  res.send("Hello this is root");
});

//signup
app.post("/signup", async (req, res) => {
  let { username, fullname, password } = req.body;
  let newUser = new User({ username, fullname });
  const registerUser = await User.register(newUser, password);
  console.log(registerUser);
  res.json({ message: "User created successfully" });
});

//login
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ user: req.user.username });
});

//logout
app.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    } else {
      res.json({ message: "User logged out successfully" });
    }
  });
});

//user
app.get("/user", async (req, res) => {
  if (req.user) {
    res.json({ user: req.user.username });
  } else {
    res.status(403).json({ message: "Not authenticated" });
  }
});

app.get("/some-route", (req, res) => {
  console.log(req.user); // this is the deserialized user object
  // rest of your route handler...
});

app.listen(8080, () => {
  console.log("Server is listening");
});
