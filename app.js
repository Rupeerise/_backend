const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const tagRouter = require("./routers/tag");
const paymentRouter = require("./routers/payment");
const appRouter = require("./routers/api");
const targetRouter = require("./routers/target");
const loanRouter = require("./routers/loan");

const app = express();
require("dotenv").config();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8081"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 200,
  })
);
// mongoose
const mongoUrl = process.env.mongo_url;
const dburl = "mongodb://localhost:27017/rupeerise";
main()
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dburl);
}

//session
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // This means the cookie will only be sent over HTTPS.
      expires: 60 * 60 * 1000,
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

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

//roots
app.get("/", (req, res) => {
  res.send("Hello this is root");
});

//api
app.use("/api", appRouter);
//tracking
app.use("/tag", tagRouter);
//payment
app.use("/payment", paymentRouter);
//target
app.use("/target", targetRouter);
//loan
app.use("/loan", loanRouter);

//not found
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

//error handling
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).json({ message });
});

app.listen(8080, () => {
  console.log("Server is listening at http://localhost:8080");
});
