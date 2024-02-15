const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const primaryTracking = require("./models/primarytracking");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const Payment = require("./models/payment");

const app = express();
require("dotenv").config();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // or the specific origin you want to allow
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

//demouser
// app.get("/demouser", (req, res) => {
//   let fakeUser = new User({ username: "demo", fullname: "Demo User" });
//   User.register(fakeUser, "demo");
//   console.log(fakeUser);
//   res.send("Hello this is demouser");
// });

//roots
app.get("/", (req, res) => {
  res.send("Hello this is root");
});

//signup
app.post("/signup", async (req, res) => {
  let { username, fullname, password } = req.body;
  let newUser = new User({ username, fullname });
  const registeredUser = await User.register(newUser, password);

  req.login(registeredUser, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error logging in user" });
    } else {
      res.json({ message: "User created and logged in successfully" });
    }
  });
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
    req.user.markModified("trackingArray");
    await req.user.save();
    const updatedUser = await User.findById(req.user._id)
      .populate("trackingArray")
      .populate({
        path: "paymentArray",
        populate: {
          path: "trackingid",
          model: "PrimaryTracking",
        },
      });
    res.json({
      username: updatedUser.username,
      trackingArray: updatedUser.trackingArray,
      paymentArray: updatedUser.paymentArray,
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

//addtracking
app.post("/addtracking", async (req, res) => {
  if (req.user) {
    let { name, target } = req.body;
    let newTracking = new primaryTracking({
      name,
      target,
      current: 0,
      secondaryTracking: [{ name: "other", target, current: 0 }],
    });
    await newTracking.save();

    req.user.trackingArray.push(newTracking);
    await req.user.save();

    res.json({ message: "Tracking added successfully" });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

//addpayment
app.post("/addpayment", async (req, res) => {
  if (req.user) {
    let { name, amount, date } = req.body;

    // Populate the trackingArray
    await req.user.populate("trackingArray");

    let trackingid = req.user.trackingArray.find(
      (tracking) => tracking.name === name
    );

    if (trackingid) {
      trackingid.current = Number(trackingid.current) + Number(amount);
      await trackingid.save();
      let newPayment = new Payment({
        trackingid: trackingid._id,
        amount,
        date,
      });
      await newPayment.save();
      req.user.paymentArray.push(newPayment);
      await req.user.save();
      res.json({ message: "Payment added successfully" });
    } else {
      res.status(404).json({ message: "Tracking not found" });
    }
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

//deletepayment
app.delete("/deletepayment/:id", async (req, res) => {
  const paymentId = req.params.id;
  const updatePayment = await Payment.findById(paymentId);
  const trackingid = updatePayment.trackingid;
  const updateTracking = await primaryTracking.findById(trackingid);
  updateTracking.current = updateTracking.current - updatePayment.amount;
  await updateTracking.save();
  await Payment.findByIdAndDelete(paymentId);
  // Remove the payment from user's paymentArray
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { paymentArray: paymentId },
  });
  res.json({ message: "Payment deleted successfully" });
});

//update tracking
app.put("/tracking/:id", async (req, res) => {
  let id = req.params.id;
  let { name, target } = req.body;
  let update = await primaryTracking.findById(id);
  update.name = name;
  update.target = target;
  await update.save();
  res.json({ message: "Tracking updated successfully" });
});

app.listen(8080, () => {
  console.log("Server is listening");
});
